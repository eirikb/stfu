import '@babel/polyfill';
import 'font-awesome/css/font-awesome.css';
import domdom from '@eirikb/domdom';
import user from './data/user';
import map from './data/map';
import Map from './map.jsx';
import Login from './login.jsx';
import {ApplicationInsights} from '@microsoft/applicationinsights-web';

const dd = domdom();
user(dd);
map(dd);

const appInsights = new ApplicationInsights({
  config: {instrumentationKey: '4c55265c-dadc-4ad5-9334-b615c3c9e36dRE'}
});
appInsights.loadAppInsights();

const view = ({on, when}) => <main>
  {on('info', info => info)}

  {when('route',
    [
      'login', () => <Login></Login>
    ])}
  {on('map', () => <Map></Map>)}
</main>;

dd.append(document.body, view);

dd.trigger('initAuth');
