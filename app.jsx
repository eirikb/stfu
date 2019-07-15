import '@babel/polyfill';
import domdom from '@eirikb/domdom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import user from './data/user';
import map from './data/map';
import iconFiles from './*.svg';
import doneFile from './done.png';

function createIcon(path) {
  return L.icon({
    iconUrl: path,
    iconSize: [32, 64],
    iconAnchor: [16, 64]
  });
}

const icons = {
  green: createIcon(iconFiles.map_icon_green),
  blue: createIcon(iconFiles.map_icon_blue),
  red: createIcon(iconFiles.map_icon_red),
  black: createIcon(iconFiles.map_icon_black),
  done: createIcon(doneFile)
};

const byGrade = {
  '0': icons.green,
  '1': icons.blue,
  '2': icons.red,
  '3': icons.black,
};

function Login({ trigger, on }) {
  return <form onSubmit={e => trigger('login', e)}>
    <input name="username" type="email"/>
    <input name="password" type="password"/>
    <button type="submit">Login</button>
    {on('login.failed', msg => <div>{msg}</div>)}
  </form>
}

function Map({ get, on }) {
  const mapElement = <div id="map"></div>;
  // TODO: mounted support in domdom
  setTimeout(() => {
    const map = L.map(mapElement).setView([62.515, 6.1], 12);
    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(map);


    function addMark(mark) {
      const icon = mark.done ? icons.done : byGrade[mark.grade];
      L.marker([mark.lat, mark.lon], { icon }).addTo(map)
        .bindPopup(`${mark.name}`)
    }

    // TODO: ! (immediate) error in domdom
    on('+* map.$id', addMark);
    Object.values(get('map')).forEach(addMark);
  });

  return mapElement;
}

const dd = domdom();
user(dd);
map(dd);

const view = ({ on, when }) => <main>
  {on('info', info => info)}

  {when('route',
    [
      'login', () => <Login></Login>
    ])}
  {on('map', () => <Map></Map>)}
</main>;

document.body.appendChild(dd.render(view));

dd.trigger('initAuth');
