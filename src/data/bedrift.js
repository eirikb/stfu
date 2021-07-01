import { queryDom } from './query';

export default function ({ on, set }) {
  on('!+* route', route => {
    if (route === 'bedrift') {
      init();
    }
  });

  async function init() {
    set('bedrift.loading', true);

    const dom = await queryDom('stikkut/stikk-ut-bedrift?nocache');
    const query = [...dom.querySelectorAll('table tr.table__entry')];

    const rows = query.map(row => {
      const cells = [...row.querySelectorAll('td')];
      const links = [...row.querySelectorAll('td.table__name > a')];

      return {
        tds: cells.map(td => td.innerText),
        name: links.map(a => a.innerText)[0],
        id: links.map(a => new URL(a.href).searchParams.get("id"))[0]
      };
    });

    set('bedrift.rows', rows);
    set('bedrift.loading', false);
  }
}