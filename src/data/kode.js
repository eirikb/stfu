import { queryDom } from './query';

export default function ({ on, set }) {

  set('kode.tur', false);
  on('+* kode.tur', tur => {
    if (tur === false) {
      set('kode.status', '');
    }
  });

  on('= check', async e => {
    e.preventDefault();
    set('kode.status', 'Sjekker...');
    const body = (e.target.kode.value || '').split('').map(part =>
      [encodeURIComponent('code[]'), encodeURIComponent(part)].join('=')
    ).join('&');

    const dom = await queryDom('/stikkut/min-side', {
      method: 'post',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body
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
    } else {
      set('kode.status', 'Finner ikke tur');
    }
  });

  on('= register', e => {
    e.preventDefault();
    const values = [...e.target.companions]
      .filter(cb => cb.checked)
      .map(cb => cb.value);
    console.log('reigster the kode!', e.target.companions);
    console.log('values', values);
    set('kode.status', 'Registrerer...');
  })
}
