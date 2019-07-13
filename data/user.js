export default ({on, set, trigger}) => {
  on('= initAuth', async () => {
    trigger('log', 'Checking auth...');
    const authed = await fetch('/stikkut/min-side', {credentials: 'include'})
      .then(r => !r.url.match(/login/));
    trigger('log', `Authed: ${authed}`);
    set('route', authed ? 'home' : 'login');
  });

  on('= login', async e => {
    e.preventDefault();
    trigger('log', 'Authenticating...');
    set('login.failed', '');
    const data = new URLSearchParams(new FormData(e.target));
    const authed = await fetch('/user/login', {
      method: 'post',
      body: data
    }).then(r => !r.url.match(/login/));
    trigger('log', `Authed: ${authed}`);
    set('login.failed', 'Login failed');
    set('route', authed ? 'home' : 'login');
  });
};