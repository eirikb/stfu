import domdom from '@eirikb/domdom';

const dd = domdom();

const view = () => <div>:)</div>;

document.body.appendChild(dd.render(view));
