export default function ({ when, on, set }) {
  return <div class="modal">
    <a class="modal-close fa fa-2x fa-times" onClick={() => set('route', 'home')}/>
    <h1>Bedrift - toppliste</h1>

    {when('bedrift.loading', [
      true, () => <span>Laster...</span>,
      false, () => <div>
        <table>
          <thead>
          <tr>
            <th>Nr.</th>
            <th>Navn</th>
            <th>Turer</th>
            <th>Turmål</th>
          </tr>
          </thead>
          <tbody>
          {(on('bedrift.rows').map(row => <tr>
              {Object.values(row).map(cell => <td>{cell}</td>)}
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    ])}
  </div>;
}
