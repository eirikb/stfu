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

export default ({ on, mounted, trigger, get, set, when }) => {
  const mapElement = <div id="map" onClick={() => set('route', 'home')}/>;
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

    map.on('locationfound', location => {
      const { lat, lng } = location.latlng;
      if (!lat || !lng) return;
      set('pos.gps', { lat, lng });
    });

    L.control.attribution({
      position: 'bottomright',
      prefix: 'Leaflet | Den spanske inkvisisjonen | domdom | Stikk UT!'
    }).addTo(map);

    L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
      attribution: 'Kartverket'
    }).addTo(map);

    L.control.scale({
      position: 'bottomright',
      imperial: false
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
            <span class="icon">⟳</span>
          </a>
        </div>;
      }
    }))({ position: 'bottomright' }).addTo(map);

    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    const l = L.control.locate({
      locateOptions: { enableHighAccuracy: true },
      position: 'bottomright',
      flyTo: true,
      keepCurrentZoomLevel: true,
      showPopup: false
    }).addTo(map);
    l.stop = () => {
      l._deactivate();
      l._cleanClasses();
      l._resetVariables();
      l._removeMarker();
      set('pos.gps', false);
    };

    on('!+* pos.elevation', elevation => {
      if (!elevation) return;
      l._marker.bindPopup(`${elevation.placename}: ${elevation.elevation}m`).openPopup();
    });

    new (L.Control.extend({
      onAdd: function () {
        const e = <div class="leaflet-control-locate leaflet-bar leaflet-control"
                       onClick={() => trigger('getElevation')}>
          <a class="leaflet-bar-part leaflet-bar-part-single">
            ⛰️
          </a>
        </div>;
        e.hidden = true;
        on('!+* pos.gps', gps =>
          e.hidden = !gps
        );
        return e;
      }
    }))({ position: 'bottomright' }).addTo(map);

    let lastTrack;
    on('!+* track', res => {
      const track = Object.values(res || {});
      if (lastTrack) {
        lastTrack.removeFrom(map);
      }
      const points = track.map(({ 0: lon, 1: lat }) => new L.LatLng(lat, lon));
      lastTrack = new L.Polyline(points, {
        smoothFactor: 1
      }).addTo(map);
    });

    on('!+* map.$id', (mark, { path }) => {
        const color = grade[mark.grade];
        const iconName = mark.done ? `${color}_done` : color;
        const icon = icons[iconName];

        const popup = L.popup({}).setContent();

        const markers = [
          L.marker([mark.lat, mark.lon], { icon })
        ];

        if (mark.name.match(/\(ny\)/i)) {
          markers.push(
            L.marker([mark.lat, mark.lon], {
              icon: L.divIcon({
                className: 'new',
                html: '*',
                iconAnchor: [-10, 80]
              })
            })
          );
        }

        if (mark.opening_date) {
          const [date, month] = mark.opening_date.split('/');
          const d = new Date();
          d.setMonth(month - 1);
          d.setDate(date);
          const isClosed = d > new Date();
          if (isClosed) {
            markers.push(
              L.marker([mark.lat, mark.lon], {
                icon: L.divIcon({
                  className: 'closed',
                  html: '!',
                  iconAnchor: [20, 80]
                }),
                bubblingMouseEvents: true
              })
            );
          }
        }

        L.featureGroup(markers)
          .bindPopup(popup)
          .on('click', () => trigger('loadMark', path))
          .addTo(map)

        function showMore(e, mark) {
          e.stopPropagation();

          set('more', mark);
          set('route', 'more');
          popup._close();
        }

        on(`!+* ${path}.*`, () => {
          const mark = get(path);
          if (typeof mark.loading === 'undefined') return;

          if (mark.loading) {
            popup.setContent(<Loading loading={`Laster ${mark.name}`}/>);
            return;
          }

          const popupContent = <div>
            <h2>{mark.name}</h2>
            {mark.visits}<br/>
            {mark.opening_date ? <div>Åpner: {mark.opening_date}</div> : null}
            {Object.values(mark.trip || {}).map(v => <div>{v}</div>)}
            {Object.values(mark.height || {}).map(v => <div>{v}</div>)}
            {mark.specialText ? <i>{mark.specialText}</i> : null}
            <a class="more" onClick={e => showMore(e, mark)}>Vis mer</a>
          </div>;
          popup.setContent(popupContent);
        });
      }
    );
  });

  return mapElement;
}
