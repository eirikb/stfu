import '@babel/polyfill';
import 'font-awesome/css/font-awesome.css';
import domdom from '@eirikb/domdom';
import user from './data/user';
import map from './data/map';
import Map from './map.jsx';

function Login({trigger, on}) {
  return <form onSubmit={e => trigger('login', e)}>
    <input name="username" type="email"/>
    <input name="password" type="password"/>
    <button type="submit">Login</button>
    <div>
      <label>
        <input type="checkbox" required/>
        <span class="the-text-with-tiny-print">
        Jeg godtar herved at innehaver av stfu.run, en stakkars kveldsprogrammerer, kan lese absolutt alt av datatrafikk
        som går mellom min fantastiske nettleser og stikkut sine nettsider via en provisorisk serverboks oppe i skya
        en eller annen plass.
        </span>
      </label>
    </div>
    {on('login.failed', msg => <div>{msg}</div>)}
  </form>
}

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
