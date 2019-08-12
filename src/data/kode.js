import { postForm, queryDom } from './query';

export default function ({ on, get, set }) {

  set('kode.tur', false);
  on('+* kode.tur', tur => {
    if (tur === false) {
      set('kode.status', '');
    }
  });

  on('= check', async e => {
    e.preventDefault();
    set('kode.status', 'Sjekker...');

    const kode = e.target.kode.value;
    const dom = await postForm('/stikkut/min-side?nocache', {
      'code[]': kode.split('')
    });
    const companions = [...dom.querySelectorAll('.form__companion')].map(companionDiv => {
      const id = companionDiv.querySelector('input').value;
      const text = companionDiv.innerText.trim();
      return { id, text }
    });
    const routeNameElement = dom.querySelector('.form__routename');
    const found = !!routeNameElement;
    if (found) {
      set('kode.status', '');
      const tur = {
        to: routeNameElement.innerText,
        companions
      };
      set('kode.tur', tur);
      set('kode.kode', kode);
    } else {
      set('kode.status', 'Finner ikke tur');
    }
  });

  on('= register', async e => {
    e.preventDefault();
    const values = [...e.target.companions]
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    const kode = get('kode.kode');
    set('kode.status', `Registrerer ${kode}...`);
    const date = new Date().toISOString().split('T')[0];
    let dom = await postForm('/stikkut/min-side?nocache', {
      codeword: kode,
      'members[]': values,
      date
    });
    const ok = ((dom.querySelector('.hero__intro') || {}).innerText || '').match(/Koden er registrert/);
    if (ok) {
      set('kode.tur', false);
      set('kode.status', 'Koden er registrert! Dobbeltsjekker...');
      dom = await queryDom('/stikkut/min-side?nocache');
      const lastTur = dom.querySelector('.regtable__name').innerText;
      set('kode.status', 'Koden er registrert! Siste tur: ' + lastTur);
    } else {
      set('kode.status', 'Noe gikk galt - IKKE registrert');
    }
  });
}
