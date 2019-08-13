import L from 'leaflet';

export default ({ on, get, set }) => {

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
};
