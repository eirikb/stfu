import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import iconFiles from '../assets/*.svg';

const icons = Object.entries(iconFiles).reduce((res, [key, value]) => {
  const icon = L.icon({
    iconUrl: value,
    iconSize: [32, 64],
    iconAnchor: [16, 64],
    popupAnchor: [0, -64]
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

export default ({on, mounted, trigger}) => {
  const mapElement = <div id="map"></div>;
  mounted(() => {
    const map = L.map(mapElement, {
      zoomControl: false
    }).setView([62.515, 6.1], 12);
    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    L.control.locate({
      locateOptions: {enableHighAccuracy: true},
      position: 'bottomright'
    }).addTo(map);

    on('!+* track', track => {
      const points = track.map(([lon, lat]) => new L.LatLng(lat, lon));
      new L.Polyline(points, {
        smoothFactor: 1
      }).addTo(map);
    });

    on('!+* map.$id', (mark, {path}) => {
        const color = grade[mark.grade];
        const iconName = mark.done ? `${color}_done` : color;
        const icon = icons[iconName];

        const popup = L.popup({}).setContent('yes');
        L.marker([mark.lat, mark.lon], {icon})
          .bindPopup(popup)
          .addTo(map)
          .on('click', () => trigger('loadMark', path));

        on(`!+* ${path}.loading`, () =>
          popup.setContent(`<h2>${mark.name}</h2> Laster...`)
        );
        on(`!+* ${path}.{length,visits,trip,height}`, () =>
          popup.setContent(`
<h2>${mark.name}</h2>
${mark.visits} <br> 
${mark.trip} <br>
${mark.height} <br>
`)
        );
      }
    );
  });

  return mapElement;
}
