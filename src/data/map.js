const parser = new DOMParser();

async function query(path) {
  if (localStorage[path]) {
    return parser.parseFromString(localStorage[path], 'text/html');
  }
  const data = await fetch(path, {credentials: 'include'}).then(r => r.text());
  localStorage[path] = data;
  return parser.parseFromString(data, 'text/html');
}

export default ({on, set}) => {
  on('+* route', route => {
    if (route === 'home') start();
  });

  async function loadMapPoints() {
    const dom = await query('/stikkut/turer');
    const mapDataText = dom.querySelector('.routemap__container script').innerText;
    const mapDataJson = mapDataText.split(/[=\n]/)[2].replace(/;/, '');
    return JSON.parse(mapDataJson);
  }

  async function loadMyPoints() {
    let dom = await query('/stikkut/min-side');
    const href = dom.querySelector('.regtable__showall').getAttribute('href');
    dom = await query(`/stikkut/min-side${href}`);
    const dones = [...dom.querySelectorAll('[data-route]')].map(node =>
      node.dataset.route
    );
    return dones.reduce((res, done) => {
      res[done] = true;
      return res;
    }, {});
  }

  async function start() {
    set('info', 'Laster kart...');
    const [map, dones] = await Promise.all([loadMapPoints(), loadMyPoints()]);
    set('info', '');
    set('map', map.reduce((res, mark) => {
      mark.done = !!dones[mark.page_id];
      res[mark.id] = mark;
      return res;
    }, {}));
  }
};
