export default ({on, set, trigger}) => {
  on('= initAuth', async () => {
    set('info', 'Logger på...');
    const authed = await fetch('/stikkut/min-side', {credentials: 'include'})
      .then(r => !r.url.match(/login/));
    set('route', authed ? 'home' : 'login');
  });

  on('= login', async e => {
    e.preventDefault();
    set('info', 'Logger på...');
    set('login.failed', '');
    const data = new URLSearchParams(new FormData(e.target));
    const authed = await fetch('/user/login', {
      method: 'post',
      body: data
    }).then(r => !r.url.match(/login/));
    set('login.failed', 'Pålogging feilet. Logg inn!');
    set('route', authed ? 'home' : 'login');
  });
};
