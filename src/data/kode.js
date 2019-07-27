import { queryDom } from './query';

export default function ({ on, set }) {
  set('kode.tur', false);

  on('= registrer', async e => {
    e.preventDefault();
    const body = (e.target.kode.value || '').split('').map(part =>
      [encodeURIComponent('code[]'), encodeURIComponent(part)].join('=')
    ).join('&');

    const dom = await queryDom('/stikkut/min-side', {
      cache: false,
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
    const tur = {
      to: dom.querySelector('.form__routename').innerText,
      companions
    };

    console.log('tur', tur);
    set('kode.tur', tur);
  });
}
