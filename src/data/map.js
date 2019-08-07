import { queryDom, queryJson } from './query';

export default ({ on, get, set, update }) => {
  on('!+* auth', auth => {
    if (auth) {
      loadMap();
    }
  });

  on('= loadMark', async path => {
    const marker = get(path);
    set(`${path}.loading`, true);
    const { page_id } = marker;
    const [dom, track] = await Promise.all([
      queryDom(`/turar/${page_id}`),
      queryJson(`/turar/json/${page_id}`)
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
    const dom = await queryDom('/stikkut/turer');
    const mapDataText = dom.querySelector('.routemap__container script').innerText;
    const mapDataJson = mapDataText.split(/[=\n]/)[2].replace(/;/, '');
    return JSON.parse(mapDataJson);
  }

  async function loadMyPoints() {
    let dom = await queryDom('/stikkut/min-side');
    const allLink = dom.querySelector('.regtable__showall');
    if (allLink) {
      const href = allLink.getAttribute('href');
      dom = await queryDom(`/stikkut/min-side${href}`);
    }
    const dones = [...dom.querySelectorAll('[data-route]')].map(node =>
      node.dataset.route
    );
    return dones.reduce((res, done) => {
      res[done] = true;
      return res;
    }, {});
  }

  async function loadMap() {
    set('loading', 'Laster kart');
    const [map, dones] = await Promise.all([loadMapPoints(), loadMyPoints()]);
    set('map', map.reduce((res, mark) => {
      mark.done = !!dones[mark.page_id];
      res[mark.id] = mark;
      return res;
    }, {}));
    set('loading', false);
  }
};
