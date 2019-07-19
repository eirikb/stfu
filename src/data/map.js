const parser = new DOMParser();

async function query(path) {
  if (localStorage[path]) {
    return parser.parseFromString(localStorage[path], 'text/html');
  }
  const data = await fetch(path, {credentials: 'include'}).then(r => r.text());
  localStorage[path] = data;
  return parser.parseFromString(data, 'text/html');
}

export default ({on, get, set, update}) => {
  on('+* route', route => {
    if (route === 'home') start();
  });

  on('= loadMark', async path => {
    const marker = get(path);
    set(`${path}.loading`, true);
    const {page_id} = marker;
    const [dom, track] = await Promise.all([
      query(`/turar/${page_id}`),
      fetch(`/turar/json/${page_id}`, {credentials: 'include'}).then(r => r.json())
    ]);
    set('track', track.track);

    const stats = dom.querySelector('.hero__stat');
    const tables = dom.querySelectorAll('.table--routeinfo') || [];
    const trip = tables[0] ? [...tables[0].querySelectorAll('tr')].slice(1).map(tr => tr.innerText).join('<br>') : '';
    const height = tables[1] ? [...tables[1].querySelectorAll('tr')].slice(1).map(tr => tr.innerText).join('<br>') : '';
    update(path, {
      visits: stats.innerText,
      trip,
      height
    });
  });

  async function loadMapPoints() {
    const dom = await query('/stikkut/turer');
    const mapDataText = dom.querySelector('.routemap__container script').innerText;
    const mapDataJson = mapDataText.split(/[=\n]/)[2].replace(/;/, '');
    return JSON.parse(mapDataJson);
  }

  async function loadMyPoints() {
    let dom = await query('/stikkut/min-side');
    const allLink = dom.querySelector('.regtable__showall');
    if (allLink) {
      const href = allLink.getAttribute('href');
      dom = await query(`/stikkut/min-side${href}`);
    }
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
