import '@babel/polyfill';
import domdom from '@eirikb/domdom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// import map from './map.json';


// console.log(map);

const dd = domdom();

const view = () => <div id="map">:)</div>;

document.body.appendChild(dd.render(view));


var map = L.map('map').setView([60.14, 10.25], 11);
L.tileLayer('https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}', {
  attribution: '<a href="http://www.kartverket.no/">Kartverket</a>'
});
