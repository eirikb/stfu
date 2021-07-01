import { queryDom, queryJson } from './query';

export default ({ on, get, set, merge }) => {
  function getColleagueId() {
    return localStorage.colleague?.substr(0, localStorage.colleague.indexOf(' '));
  }

  on('!+* auth', auth => {
    if (auth) {
      loadMap(getColleagueId());
    }
  });

  on('= loadMark', async path => {
    const marker = get(path);
    set('pos.marker', { lat: marker.lat, lng: marker.lon });
    set(`${path}.loading`, true);
    const { page_id } = marker;
    const [dom, track] = await Promise.all([
      queryDom(`/turar/${page_id}`),
      queryJson(`/turar/json/${page_id}`)
    ]);
    set('track', track.track);

    const stats = dom.querySelector('.hero__stat');
    const tables = dom.querySelectorAll('.table--routeinfo') || [];
    const trip = tables[0] ? [...tables[0].querySelectorAll('tr')].slice(1).map(tr => tr.innerText) : [];
    const height = tables[1] ? [...tables[1].querySelectorAll('tr')].slice(1).map(tr => tr.innerText) : [];

    const routeElements = [...dom.querySelectorAll('.route__content > *')];
    const routeInfo = [];
    let section;
    let specialText = '';
    for (let routeElement of routeElements) {
      const { tagName } = routeElement;
      const isHeader = tagName.startsWith('H');
      const isScript = tagName === 'SCRIPT';
      const isProbablyMap = routeElement.className.match(/route__map-wrapper/);
      const text = (routeElement.innerText || '').trim();
      if (isHeader) {
        if (section && section.parts.length > 0) {
          routeInfo.push(section);
        }
        section = {
          name: text,
          parts: []
        }
      } else if (!isHeader && !isScript && !isProbablyMap && section && text) {
        section.parts.push(text);
      } else if (!section && text) {
        specialText = text;
        section = {
          name: '',
          parts: [text]
        }
      }
    }

    merge(path, {
      loading: false,
      visits: stats.innerText,
      trip,
      height,
      routeInfo,
      specialText
    });
  });

  async function loadMapPoints() {
    const dom = await queryDom('/stikkut/turer');
    const mapDataText = dom.querySelector('.routemap__container script').innerText;
    const mapDataJson = mapDataText.split(/[=\n]/)[2].replace(/;/, '');
    return JSON.parse(mapDataJson);
  }

  async function loadPoints(colleague) {
    if(colleague) {
      return loadSomeonesPoints(colleague);
    }
    else {
      return loadMyPoints();
    }
  }

  async function loadSomeonesPoints(colleague) {
    let dom = await queryDom(`stikkut/stikk-ut-bedrift?tab=colleague&id=${colleague}`);
    const links = dom.querySelectorAll('.table__secondary-link');
    let result = []

    if (links) {
      result = [...links].map(node => node.href.substring(node.href.lastIndexOf('/')+ 1))
    }

    return result.reduce((res, done) => {
      res[done] = true;
      return res;
    }, {});
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

  async function loadMap(colleague) {
    set('loading', 'Laster kart');
    const [map, dones] = await Promise.all([loadMapPoints(), loadPoints(colleague)]);
    set('map', map.reduce((res, mark) => {
      mark.done = !!dones[mark.page_id];
      res[mark.id] = mark;
      return res;
    }, {}));
    set('loading', false);
  }
};
