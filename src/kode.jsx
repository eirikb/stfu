export default function ({ when, get, set, trigger }) {

  function inputMode(e) {
    const { target } = e;
    target.inputMode = target.value.length >= 2 ? 'numeric' : 'text';
    target.value = target.value.toUpperCase().slice(0, 4);
  }

  function test(e) {
    e.preventDefault();
    trigger('registrer', e);
  }

  function TurForm({ tur }) {
    console.log(tur);
    return <form>
      <h2>{tur.to}</h2>
      {tur.companions.map(companion =>
        <label>
          <input value={companion.id}/>
          {companion.text}
        </label>
      )}
    </form>;
  }

  function RegisterForm() {
    return <form onSubmit={test}>
      <input onInput={inputMode}
             name="kode"
             autocapitalize="characters"
             pattern="[A-Z][A-Z][0-9][0-9]"
             placeholder="Kode"/>
      <button type="submit">Registrer kode</button>
    </form>;
  }

  return <div class="modal">
    <div class="kode">
      <a class="modal-close fa fa-2x fa-close" onClick={() => set('route', 'home')}/>
      <h1>Registrer kode</h1>

      {when('kode.tur', [
        false, () => <RegisterForm/>,
        tur => !!tur, tur => <TurForm dd-input-tur={tur}/>
      ])}
    </div>
  </div>;
}
