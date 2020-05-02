export default function ({ get, set }) {
  return <div class="modal">
    <a class="modal-close fa fa-2x fa-times" onClick={() => set('route', 'home')}/>

    {get('more.routeInfo').map(route =>
      <section>
        <h1>{route.name}</h1>
        {route.parts.map(part => <p>{part}</p>)}
      </section>
    )}
  </div>;
}
