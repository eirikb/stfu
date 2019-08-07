import { query } from './query';

export default ({ on, set }) => {
  on('= initAuth', async () => {
    set('info', 'Logger på...');
    const authed = await query('/stikkut/min-side').then(r => !r.url.match(/login/));

    set('info', '');
    set('auth', authed);
    set('route', authed ? 'home' : 'login');
  });

  on('= login', async e => {
    e.preventDefault();
    set('info', 'Logger på...');
    set('login.failed', '');
    const data = new URLSearchParams(new FormData(e.target));
    const authed = await query('/user/login', {
      method: 'post',
      body: data
    }).then(r => !r.url.match(/login/));
    if (authed) {
      set('route', 'home');
      set('auth', true);
    } else {
      set('login.failed', 'Pålogging feilet. Prøv på nytt!');
      set('info', '');
    }
  });

  on('= logout', async () => {
    if (!confirm('Er ikke du ikke sikker på du ikke vil ikke logge ut?')) return;

    localStorage.clear();
    sessionStorage.clear();
    await query('/user/logout');
    window.location.reload();
  });
};
