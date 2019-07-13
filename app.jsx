import '@babel/polyfill';
import domdom from '@eirikb/domdom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {divIcon} from "leaflet/dist/leaflet-src.esm";
import user from './data/user';
import map from './data/map';

function Login({trigger, on}) {
  return <form onSubmit={e => trigger('login', e)}>
    <input name="username" type="email"/>
    <input name="password" type="password"/>
    <button type="submit">Login</button>
    {on('login.failed', msg => <div>{msg}</div>)}
  </form>
}

const dd = domdom();
user(dd);
map(dd);

const view = ({on, when}) => <div>
  <div class="log">
    LOG:
    {on('logs.$id', line => <div>{line}</div>)}
  </div>

  {when('route',
    [
      'login', () => <Login></Login>,
      'home', () => <div>Yes!</div>
    ])}
</div>;

document.body.appendChild(dd.render(view));

dd.on('= log', line => dd.set(`logs.${Date.now()}`, line));

dd.trigger('initAuth');


// var map = L.map('map').setView([60.14, 10.25], 11);
// L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
//   attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
// });
