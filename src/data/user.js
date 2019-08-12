import { query } from './query';

export default ({ on, set }) => {
  on('= initAuth', async () => {
    try {
      const authed = await query('/stikkut/min-side?nocache').then(r => !r.url.match(/login/));
      document.body.removeChild(
        document.querySelector('#intro')
      );
      set('auth', authed);
      set('route', authed ? 'home' : 'login');
    } catch (e) {
      console.log(e);
      console.log('failed to login');
    }
  });

  on('= login', async e => {
    e.preventDefault();
    set('loading', 'Logger på');
    set('login.failed', '');
    const data = new URLSearchParams(new FormData(e.target));
    const authed = await query('/user/login?nocache', {
      method: 'post',
      body: data
    }).then(r => !r.url.match(/login/));
    set('loading', false);
    if (authed) {
      set('route', 'home');
      set('auth', true);
    } else {
      set('login.failed', 'Pålogging feilet. Prøv på nytt!');
    }
  });

  on('= logout', async () => {
    if (!confirm('Er ikke du ikke sikker på du ikke vil ikke logge ut?')) return;

    localStorage.clear();
    sessionStorage.clear();
    await query('/user/logout?nocache');
    window.location.reload();
  });
};
