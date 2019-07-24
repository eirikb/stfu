export default function ({ when, get, set }) {
  return <div class="modal">
    <a class="modal-close fa fa-2x fa-close" onClick={() => set('route', 'home')}/>
    <h1>Bedriter - toppliste</h1>

    {when('bedrift.loading', [
      true, () => <span>Laster...</span>,
      false, () => <div>
        <table>
          <thead>
          <tr>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
          </tr>
          </thead>
          <tbody>
          {(get('bedrift.rows').map(row => <tr>
              {row.map(cell => <td>{cell}</td>)}
            </tr>
          ))}

          </tbody>
        </table>


      </div>
    ])}
  </div>;
}
