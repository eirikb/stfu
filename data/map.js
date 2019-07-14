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
    const fromCache = fromLocalstorage('map');
    if (fromCache != null) {
      trigger('log', 'Got map from cache');
      return fromCache;
    }
    const dom = await query('/stikkut/turer');
    const mapDataText = dom.querySelector('.routemap__container script').innerText;
    const mapDataJson = mapDataText.split(/[=\n]/)[2].replace(/;/, '');
    const mapData = JSON.parse(mapDataJson);
    trigger('log', `Loaded ${mapData.length} map points`);
    localStorage.map = JSON.stringify(mapData);
    return mapData;
  }

  async function loadMyPoints() {
    trigger('log', 'Loading my points (1/2)...');
    const fromCache = fromLocalstorage('names');
    if (fromCache != null) {
      trigger('log', 'Got points from cache');
      return fromCache;
    }
    let dom = await query('/stikkut/min-side');
    const href = dom.querySelector('.regtable__showall').getAttribute('href');
    trigger('log', 'Loading my points (2/2)...');
    dom = await query(`/stikkut/min-side${href}`);
    const names = [...dom.querySelectorAll('.regtable__name')].map(node => {
      const location = node.querySelector('div');
      node.removeChild(location);
      return {title: node.innerText.trim(), location: location.innerText.trim()}
    });
    trigger('log', `Got a total of ${names.length} of 'My points'`);
    localStorage.names = JSON.stringify(names);
    return names;
  }

  async function start() {
    const [map, names] = await Promise.all([loadMapPoints(), loadMyPoints()]);
    set('map', map.reduce((res, mark) => {
      mark.done = !!names.find(({title}) => title === mark.name);
      res[mark.id] = mark;
      return res;
    }, {}));
  }
};
