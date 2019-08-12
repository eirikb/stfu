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
    const rows = [...dom.querySelectorAll('table tr.table__entry')].map(row => [...row.querySelectorAll('td')].map(td => td.innerText));
    set('bedrift.rows', rows);
    set('bedrift.loading', false);
  }
}