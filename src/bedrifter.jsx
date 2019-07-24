export default function ({ trigger, on, set }) {
  return <div class="modal">
    <a class="modal-close fa fa-2x fa-close" onClick={() => set('route', 'home')}/>
    <h1>BEDRIFTER!</h1>
  </div>;
}
