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

const view = ({on, when, set}) => <main>
  {on('info', info => info)}

  {when('route',
    [
      'login', () => <Login></Login>,
      'home', () => <button onClick={() => set('route', 'menu')}>MENU</button>,
      'menu', () => <div>HERE IS A MENU, GUYS
      <button onClick={() => set('route', 'home')}>CLOSE</button>
    </div>
    ])}

  {on('map', () => <Map></Map>)}
</main>;

dd.append(document.body, view);

dd.trigger('initAuth');
