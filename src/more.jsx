export default function ({ get, set }) {
  return <div class="modal">
    <a class="modal-close fa fa-2x fa-close" onClick={() => set('route', 'home')}/>

    {get('more.routeInfo').map(route =>
      <section>
        <h3>{route.name}</h3>
        {route.parts.map(part => <p>{part}</p>)}
      </section>
    )}
  </div>;
}
