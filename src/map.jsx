import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import iconFiles from '../assets/*.svg';

const icons = Object.entries(iconFiles).reduce((res, [key, value]) => {
  res[key] = L.icon({
    iconUrl: value,
    iconSize: [32, 64],
    iconAnchor: [16, 64],
    popupAnchor: [0, -64]
  });
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
    let lastCenter = (localStorage.center || '').split(' ').map(p => parseFloat(p));
    lastCenter = lastCenter.length === 3 ? lastCenter : null;
    const center = lastCenter ? lastCenter.slice(0, 2) : [62.5, 6.1];
    const zoom = lastCenter ? lastCenter[2] : 10;
    const map = L.map(mapElement, {
      zoomControl: false,
      attributionControl: false
    }).setView(center, zoom);

    map.on('move', () => {
      const {lat, lng} = map.getCenter();
      const zoom = map.getZoom();
      localStorage.center = [lat, lng, zoom].join(' ');
    });

    L.control.attribution({
      position: 'bottomright',
      prefix: 'Leaflet | Stikk UT!'
    }).addTo(map);

    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: 'Kartverket'
    }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    new (L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create('div', 'leaflet-control-locate leaflet-bar leaflet-control');
        const a = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single');
        a.title = 'Oppdater';
        const span = L.DomUtil.create('span', 'fa fa-refresh');
        div.appendChild(a);
        a.appendChild(span);

        div.addEventListener('click', () => {
          localStorage.clear();
          window.location.reload();
        });

        return div;
      }
    }))({position: 'bottomright'}).addTo(map);

    L.control.locate({
      locateOptions: {enableHighAccuracy: true},
      position: 'bottomright'
    }).addTo(map);

    let lastTrack;
    on('!+* track', track => {
      if (lastTrack) {
        lastTrack.removeFrom(map);
      }
      const points = track.map(([lon, lat]) => new L.LatLng(lat, lon));
      lastTrack = new L.Polyline(points, {
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
