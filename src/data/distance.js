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
    if (!marker || !gps) {
      set('pos.distance', false);
      return;
    }
    set('pos.distance', marker.distanceTo(gps));
  });

  function pointClosestTo(track, target) {
    return track.reduce((res, point) =>
      (!res || point.distanceTo(target) < res.distanceTo(target)) ? point : res
    );
  }

  function trackDistance(track, startPoint) {
    return track.reduce((res, point) => {
      return { distance: res.distance + res.point.distanceTo(point), point };
    }, { distance: 0, point: startPoint }).distance;
  }

  function shortesPath() {
    const track = (get('track') || []).map(([lon, lat]) => new L.LatLng(lat, lon));
    const marker = toLatLng('pos.marker');
    const gps = toLatLng('pos.gps');
    if (!track || !gps || !marker) {
      set('pos.trackDistance', false);
      return;
    }

    const pointClosestToMarker = pointClosestTo(track, marker);
    const pointClosestToGps = pointClosestTo(track, gps);

    const pointClosestToGpsIndex = track.indexOf(pointClosestToGps);
    const pointClosestToMarkerIndex = track.indexOf(pointClosestToMarker);
    const startIndex = Math.min(pointClosestToGpsIndex, pointClosestToMarkerIndex);
    const endIndex = Math.max(pointClosestToGpsIndex, pointClosestToMarkerIndex);

    const leftPath = trackDistance(track.slice(startIndex, endIndex + 1), gps);
    const rightPath = trackDistance(track.slice(endIndex, track.length).concat(track.slice(0, startIndex + 1)), gps);
    set('pos.trackDistance', Math.min(leftPath, rightPath));
  }

  on('!+* pos.{gps,marker}', shortesPath);
  on('!+* track', shortesPath);
};
