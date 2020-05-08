export default function ({ get, set, trigger }) {
  return <div class="modal">
    <a class="modal-close icon" onClick={() => set('route', 'home')}>✕</a>
    <h1>Error!</h1>

    Det har skjedd en fryktelig feil inne i koden:
    <p class="darn">
      {get('error')}
    </p>

    <div class="kode">
      Prøv å logg inn/ut:<br/>
      <button type="button" onClick={() => trigger('logout')}>Logg ut</button>
    </div>
  </div>;
}
