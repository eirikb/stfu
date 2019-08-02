export default function ({ on, when, text, set, trigger }) {

  function inputMode(e) {
    const { target } = e;
    target.inputMode = target.value.length >= 2 ? 'numeric' : 'text';
    target.value = target.value.toUpperCase().slice(0, 4);
  }

  function RegisterForm({ tur }) {
    // TODO: Fix in domdom
    if (!tur.companions) return <div></div>;

    return <form onSubmit={e => trigger('register', e)}>
      <h2>{tur.to}</h2>
      {tur.companions.map((companion, i) =>
        <label>
          <input value={companion.id} type="checkbox" checked={i === 0} name="companions"/>
          {companion.text}
        </label>
      )}
      <button type="button" onClick={() => set('kode.tur', false)}>Avbryt</button>
      <button type="submit">Registrer kode!</button>
    </form>;
  }

  function CheckForm() {
    return <form onSubmit={e => trigger('check', e)}>
      <input onInput={inputMode}
             name="kode"
             autocapitalize="characters"
             pattern="[A-Z][A-Z][0-9][0-9]"
             placeholder="Kode"/>
      <button type="submit">Sjekk kode</button>
    </form>;
  }

  return <div class="modal">
    <div class="kode">
      <a class="modal-close fa fa-2x fa-close" onClick={() => set('route', 'home')}/>
      <h1>Registrer kode</h1>

      {when('kode.tur', [
        false, () => <CheckForm/>,
        tur => !!tur, tur => <RegisterForm dd-input-tur={tur}/>
      ])}
      {text('kode.status')}
    </div>
  </div>;
}
