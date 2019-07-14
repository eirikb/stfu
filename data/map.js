const parser = new DOMParser();

async function query(path) {
  const data = await fetch(path, {credentials: 'include'}).then(r => r.text());
  return parser.parseFromString(data, 'text/html');
}

function fromLocalstorage(key) {
  try {
    return JSON.parse(localStorage[key]);
  } catch (e) {
    return null;
  }
}

export default ({on, set, trigger}) => {
  on('+* route', route => {
    if (route === 'home') start();
  });

  async function loadMapPoints() {
    trigger('log', 'Loading map...');
    const dom = await query('/stikkut/turer');
    const mapDataText = dom.querySelector('.routemap__container script').innerText;
    const mapDataJson = mapDataText.split(/[=\n]/)[2].replace(/;/, '');
    const mapData = JSON.parse(mapDataJson);
    trigger('log', `Loaded ${mapData.length} map points`);
    return mapData;
  }

  async function loadMyPoints() {
    trigger('log', 'Loading my points (1/2)...');
    let dom = await query('/stikkut/min-side');
    const href = dom.querySelector('.regtable__showall').getAttribute('href');
    trigger('log', 'Loading my points (2/2)...');
    dom = await query(`/stikkut/min-side${href}`);
    const dones = [...dom.querySelectorAll('[data-route]')].map(node =>
      node.dataset.route
    );
    trigger('log', `Got a total of ${dones.length} of 'My points'`);
    return dones.reduce((res, done) => {
      res[done] = true;
      return res;
    }, {});
    return dones;
  }

  async function start() {
    const [map, dones] = await Promise.all([loadMapPoints(), loadMyPoints()]);
    set('map', map.reduce((res, mark) => {
      mark.done = !!dones[mark.page_id];
      res[mark.id] = mark;
      return res;
    }, {}));
  }
};
