import '@babel/polyfill';
import domdom from '@eirikb/domdom';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

import user from './data/user';
import map from './data/map';
import bedrift from './data/bedrift';
import kode from './data/kode';
import online from './data/online';
import distance from './data/distance';
import elevation from './data/elevation';
import { isLocalhost } from './data/query';

import Map from './map';
import Login from './login';
import Bedrift from './bedrift';
import Kode from './kode';
import Error from './error';
import Loading from './loading';
import More from './more';
import Online from './online';
import Distance from './distance';

const view = ({ on, when, set, trigger }) => <main>
  {on('info', info => info)}
  {when('loading', [
    l => !!l, loading => <Loading loading={loading}/>
  ])}

  {when('route',
    [
      'login', () => <Login/>,
      'bedrift', () => <Bedrift/>,
      'kode', () => <Kode/>,
      'more', () => <More/>,
      'error', () => <Error/>,
      'home', () => <a onClick={() => set('route', 'menu')} class="menu icon">☰</a>,
      'menu', () => <div class="menu">
      <div class="wrapper">
        <div class="content">
          <a class="link" onClick={() => set('route', 'bedrift')}>Toppliste Bedrift</a>
          <a class="link" onClick={() => set('route', 'kode')}>Registrer kode</a>
          <a class="link" onClick={() => trigger('logout')}>Logg ut</a>
          <a className="link" href="https://github.com/eirikb/stfu" target="_blank">Kildekode</a>
          <a class="menu icon" onClick={() => set('route', 'home')}>✕</a>
        </div>
      </div>
    </div>
    ])}

  {on('map', () => <Map/>)}
  <Online/>
  <Distance/>
</main>;


const dd = domdom(document.body, view);
user(dd);
map(dd);
bedrift(dd);
kode(dd);
online(dd);
distance(dd);
elevation(dd);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('../sw.js')
  );
}

if (!isLocalhost) {
  const appInsights = new ApplicationInsights({
    config: { instrumentationKey: '4c55265c-dadc-4ad5-9334-b615c3c9e36d', disableExceptionTracking: false }
  });
  appInsights.loadAppInsights();
  appInsights.trackPageView({ name: 'home' });
  window.onerror = error => {
    appInsights.trackException({
      exception: new window.Error(error)
    });
    appInsights.flush();
    dd.set('error', '' + error);
    dd.set('route', 'error');
  };
}

dd.trigger('initAuth');

document.addEventListener('keydown', e => {
  if (e.code === 'Escape') {
    dd.set('route', 'home');
  }
});
