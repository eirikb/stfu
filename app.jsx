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

function gradeToIcon(grade) {
  switch (grade) {
    case '0':
      return icons.green;
    case '1':
      return icons.blue;
    case '2':
      return icons.red;
    case '3':
      return icons.black;
  }
}


function Login({trigger, on}) {
  return <form onSubmit={e => trigger('login', e)}>
    <input name="username" type="email"/>
    <input name="password" type="password"/>
    <button type="submit">Login</button>
    {on('login.failed', msg => <div>{msg}</div>)}
  </form>
}

function Map({get, on}) {
  const mapElement = <div id="map"></div>;
  setTimeout(() => {
    const map = L.map(mapElement).setView([62.515, 6.1], 12);
    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(map);


    function addMark(mark) {
      const icon = mark.done ? icons.done : gradeToIcon(mark.grade);
      L.marker([mark.lat, mark.lon], {icon}).addTo(map)
        .bindPopup(`${mark.name}`)
    }

    on('+* map.$id', addMark);
    Object.values(get('map')).forEach(addMark);
  }, 1000);


  return mapElement;
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
      'home', () => <div>
      {on('map', () => <Map></Map>)}
    </div>
    ])}
</div>;

document.body.appendChild(dd.render(view));

dd.on('= log', line => dd.set(`logs.${Date.now()}`, line));

dd.trigger('initAuth');
