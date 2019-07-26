export default function ({ when, get, set }) {

  function inputMode(e) {
    const { target } = e;
    target.inputMode = target.value.length >= 2 ? 'numeric' : 'text';
  }

  return <div class="modal">
    <a class="modal-close fa fa-2x fa-close" onClick={() => set('route', 'home')}/>
    <h1>Registrer kode</h1>

    <input onInput={inputMode} autocapitalize="characters" pattern="[A-Z][A-Z][0-9][0-9]"/>

  </div>;
}
