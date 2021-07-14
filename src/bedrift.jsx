export default function ({ when, on, set }) {
  function setColleague(id, name) {
    localStorage.colleague = `${id} ${name}`;
    delete localStorage.center;
    window.location.reload();
  }

  return <div class="modal">
    <a class="modal-close icon" onClick={() => set('route', 'home')}>✕</a>
    <h1>Toppliste min bedrift</h1>

    {when('bedrift.loading', [
      true, () => <span>Laster...</span>,
      false, () => <div>
        <table class="ranking">
          <thead>
          <tr>
            <th>Nr.</th>
            <th>Navn</th>
            <th>Turmål</th>
            <th>Turer</th>
          </tr>
          </thead>
          <tbody>
          {(on('bedrift.rows.$x', row => <tr>
              {Object.values(row.tds).map(cell => <td><a onClick={() => setColleague(row.id, row.name)}>{cell}</a></td>)}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    ])}
  </div>;
}
