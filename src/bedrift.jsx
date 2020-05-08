export default function ({ when, on, set }) {
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
            <th>Turer</th>
            <th>Turmål</th>
          </tr>
          </thead>
          <tbody>
          {(on('bedrift.rows.$x', row => <tr>
              {Object.values(row).map(cell => <td>{cell}</td>)}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    ])}
  </div>;
}
