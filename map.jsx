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
},{});

const byGrade = {
  '0': icons.green,
  '1': icons.blue,
  '2': icons.red,
  '3': icons.black,
};
const byGradeDone = {
  '0': icons.green_done,
  '1': icons.blue_done,
  '2': icons.red_done,
  '3': icons.black_done,
};

export default ({on, mounted}) => {
  const mapElement = <div id="map"></div>;
  mounted(() => {
    const map = L.map(mapElement).setView([62.515, 6.1], 12);
    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(map);

    on('!+* map.$id', mark => {
      const icon = mark.done ? byGradeDone[mark.grade] : byGrade[mark.grade];
      L.marker([mark.lat, mark.lon], {icon}).addTo(map)
        .bindPopup(`${mark.name}`)
    });
  });

  return mapElement;
}
