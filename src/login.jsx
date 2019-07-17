export default function Login({trigger, on}) {
  return <form onSubmit={e => trigger('login', e)}>
    <p>Login</p>
    <input name="username" type="email" placeholder="E-post"/>
    <input name="password" type="password" placeholder="Passord"/>
    <button type="submit">Login</button>
    <div>
      <label>
        <input type="checkbox" required/>
        <span class="the-text-with-tiny-print">
        Jeg godtar herved at innehaver av stfu.run, en stakkars kveldsprogrammerer, kan lese absolutt alt av datatrafikk
        som går mellom min fantastiske nettleser og stikkut sine nettsider via en provisorisk serverboks oppe i skya
        en eller annen plass.
        </span>
      </label>
    </div>
    {on('login.failed', msg => <div>{msg}</div>)}
  </form>
}
