export default function ({ when, on, set, trigger }) {
  function RegisterForm({ tur }) {
    return (
      <form class="confirm" onSubmit={(e) => trigger("register", e)}>
        <h2>{tur.to}</h2>
        {Object.values(tur.companions || {}).map((companion, i) => (
          <label>
            <input
              value={companion.id}
              type="checkbox"
              checked={i === 0}
              name="companions"
            />
            {companion.text}
          </label>
        ))}
        <button class="confirm" type="submit">
          Registrer kode!
        </button>
        <button
          class="cancel"
          type="button"
          onClick={() => set("kode.tur", false)}
        >
          Avbryt
        </button>
      </form>
    );
  }

  function CheckForm() {
    return (
      <form class="enter" onSubmit={(e) => trigger("check", e)}>
        <input
          name="kode"
          autocapitalize="characters"
          pattern="[A-Za-z][A-Za-z][0-9][0-9]"
          placeholder="Kode"
        />
        <button type="submit">Sjekk kode</button>
      </form>
    );
  }

  return (
    <div class="modal">
      <div class="kode">
        <a class="modal-close icon" onClick={() => set("route", "home")}>
          ✕
        </a>
        <h1>Registrer kode</h1>

        {when("kode.tur", [
          false,
          () => <CheckForm />,
          (tur) => !!tur,
          (tur) => <RegisterForm tur={tur} />,
        ])}
        {on("kode.status")}
      </div>
    </div>
  );
}
