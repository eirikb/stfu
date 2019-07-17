import '@babel/polyfill';
import 'font-awesome/css/font-awesome.css';
import domdom from '@eirikb/domdom';
import user from './data/user';
import map from './data/map';
import Map from './map.jsx';
import Login from './login.jsx';

const dd = domdom();
user(dd);
map(dd);

const view = ({on, when}) => <main>
  {on('info', info => info)}

  {when('route',
    [
      'login', () => <Login></Login>
    ])}
  {on('map', () => <Map></Map>)}
</main>;

document.body.appendChild(dd.render(view));

dd.trigger('initAuth');
