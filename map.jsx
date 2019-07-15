import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconFiles from './icons/*.svg';

const icons = Object.entries(iconFiles).reduce((res, [key, value]) => {
  const icon = L.icon({
    iconUrl: value,
    iconSize: [32, 64],
    iconAnchor: [16, 64]
  });
  res[key] = icon;
  return res;
}, {});

const grade = {
  '0': 'green',
  '1': 'blue',
  '2': 'red',
  '3': 'black',
};

export default ({on, mounted}) => {
  const mapElement = <div id="map"></div>;
  mounted(() => {
    const map = L.map(mapElement).setView([62.515, 6.1], 12);
    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(map);

    on('!+* map.$id', mark => {
      const color = grade[mark.grade];
      const iconName = mark.done ? `${color}_done` : color;
      const icon = icons[iconName];
      L.marker([mark.lat, mark.lon], {icon}).addTo(map)
        .bindPopup(`${mark.name}`)
    });
  });

  return mapElement;
}
