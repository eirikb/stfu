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
        som går mellom min fantastiske nettleser og Stikk UT! sine nettsider via en provisorisk serverboks oppe i skya
        en eller annen plass.
          Mange kaller dette for MITM, eller mannen i midten, som høres tildels skummelt ut, men man har ingenting
          å frykte fordi han fyren i midten i dette tilfellet er en helt grei fyr.
          Ingenting blir logget på server, og ingenting lagres persistent, GDPR Compliant fra kjeller til sky.
          <br/>
          Jeg godtar også at kaker (cookies) blir bruk til tracking (ingen vet hvordan trackingen faktisk fungerer
          under panseret, men mange gjetter på at 'cookies' er brukt, og dermed er det lurt at man bare sier 'oky doky'
          til dette - merk at siden _ikke_ sender data til Silicon Valley
          (ref. Google Alphabet gigacoroporate incorporated) eller Huawei. Hovedgrunnen til trackingen er for å
          få oversikt over brukt, og et lite 'pling' når noe tryner. En god del data pushes fra nettleser,
          GDPR Compliant ikke i heletatt.
          <br/>
          Utvikleren vil også understreke at han ikke er på noen måte i sammarbeid med Stikk UT! og at de ikke har
          noe med denne appen å gjøre, alt er gjort av eget initiativ på kveldstid helt gratis i jakt på
          et en bedre turregistreringsmulighet.
          <br/>
          Alt vel. Lev vel.
        </span>
      </label>
    </div>
    {on('login.failed', msg => <div>{msg}</div>)}
  </form>
}
