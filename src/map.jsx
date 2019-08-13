import 'leaflet/dist/leaflet.css';
import 'leaflet.locatecontrol/dist/L.Control.Locate.css';
import L from 'leaflet';
import 'leaflet.locatecontrol';
import iconFiles from '../assets/*.svg';
import Loading from './loading';

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

export default ({ on, mounted, trigger, get, set }) => {
  const mapElement = <div id="map" onClick={() => set('route', 'home')}></div>;
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
      const { lat, lng } = map.getCenter();
      const zoom = map.getZoom();
      localStorage.center = [lat, lng, zoom].join(' ');
    });

    L.control.attribution({
      position: 'bottomright',
      prefix: 'Leaflet | Den spanske inkvisisjonen | Stikk UT!'
    }).addTo(map);

    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: 'Kartverket'
    }).addTo(map);

    new (L.Control.extend({
      onAdd: function () {
        function refresh() {
          const center = localStorage.center;
          localStorage.clear();
          localStorage.center = center;
          window.location.reload();
        }

        return <div class="leaflet-control-locate leaflet-bar leaflet-control" onClick={refresh}>
          <a class="leaflet-bar-part leaflet-bar-part-single">
            <span class="fa fa-refresh"></span>
          </a>
        </div>;
      }
    }))({ position: 'bottomright' }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    function toLatLng(path) {
      const o = get(path);
      if (!o) return;
      const { lat, lng } = get(path);
      if (!lat || !lng) return;
      return new L.LatLng(lat, lng);
    }

    on('!+* pos.{gps,marker}', () => {
      const marker = toLatLng('pos.marker');
      const gps = toLatLng('pos.gps');
      if (!marker || !gps) return;
      set('pos.distance', marker.distanceTo(gps));
    });

    map.on('locationfound', location => {
      const { lat, lng } = location.latlng;
      if (!lat || !lng) return;
      set('pos.gps', { lat, lng });
    });

    L.control.locate({
      locateOptions: { enableHighAccuracy: true },
      position: 'bottomright',
      flyTo: true,
      keepCurrentZoomLevel: true
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

    on('!+* map.$id', (mark, { path }) => {
        const color = grade[mark.grade];
        const iconName = mark.done ? `${color}_done` : color;
        const icon = icons[iconName];

        const popup = L.popup({}).setContent('yes');
        L.marker([mark.lat, mark.lon], { icon })
          .bindPopup(popup)
          .addTo(map)
          .on('click', () => trigger('loadMark', path));

        function showMore(e, mark) {
          e.stopPropagation();

          set('more', mark);
          set('route', 'more');
          popup._close();
        }

        on(`!+* ${path}.{length,visits,trip,height,loading}`, () => {
          const mark = get(path);
          if (typeof mark.loading === 'undefined') return;

          if (mark.loading) {
            popup.setContent(<Loading dd-input-loading={`Laster ${mark.name}`}/>)
            return;
          }

          const popupContent = <div>
            <h2>{mark.name}</h2>
            {mark.visits}<br/>
            {(mark.trip || []).map(v => <div>{v}</div>)}
            {(mark.height || []).map(v => <div>{v}</div>)}
            <a class="more" onClick={e => showMore(e, mark)}>Vis mer</a>
          </div>;
          popup.setContent(popupContent);
        });
      }
    );
  });

  return mapElement;
}
