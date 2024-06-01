# Kroken på døra

En tid er forbi.   
Stikkutgjengen har valgt å skru av all mulighet for registrering og datauthenting på https://www.stikkut.no/ .  
Dette betyr at stfu.run ikke lenger kan fungere, uten at vi reverse-engineerer appen. Det er jo mulig, men litt for mye for meg nå, samt de blir nok ikke så veldig glade.  
Domenet stfu.run er sagt opp.

Etter å ha brukt den nye stikkutappen en stund nå må jeg ærlig innrømme at stfu.run hadde fortsatt et raskere, enklere og mye bedre kart.


# Stikk The F*** UT! https://stfu.run  - En alternativ Stikk UT!-app
![stfu](https://i.imgur.com/cwE4Eyv.png)

## Features

  - Rask(ere)
  - Gjennomførte turer er gjennomsiktige
  - Fullskjerm (PWA)
  - Avstandsmåling til markør
    - Både luflinje, også kjent som kråkedistanse,
    - og via sti (hjemmebrygget algoritme, forvent mindre)
  - Offlinestøtte deluxe
    - Cacher kart
    - Cacher rute
    - Cacher rutetekst
    - Cacher ruteinfo
  - Høydemålingsmulighet
  - Info om tur uten å miste kontekst
  - Mer info om tur i boble
  - Husker kartvisning
  - "Gå til meg takk" beholder samme zoomnivå
  - Registrering av tur
  - Toppliste for bedrift
  - Viser i kart hvilke turer som er nye
  - Viser i kart hvilke turer som ikke har åpnet enda

### Utvikling

```Bash
npm i
npm start
```

### Plan

  - [ ] Styling
    - [ ] Bytte ikoner til noe kulere enn FontAwesome
    - [ ] Lage litt spinners for lastinger
  - [ ] Flybilder
  - [ ] Målelinjal
  - [ ] Laste segmenter fra Doogal
  - [ ] "Mine nemesis" - lokal liste over personer man vil konkurrere mot
  - [ ] Min bedrift: Trykke på person og få opp kart med alle turmål (og tall for antall besøk)
  - [x] ~~domdom~~
  - [x] ~~Reverse proxy~~
  - [x] ~~Custom domene~~
  - [x] ~~Let's Encrypt~~
  - [x] ~~Innlogging / auth~~
  - [x] ~~Lasting av kart etter innlogging uten å måtte refreshe siden (sært)~~
  - [x] ~~Defaultposisjon i kart - plukk fra stikkutbruker - husk i localStorage~~
  - [x] ~~Vise høydemeter for posisjonen~~
  - [x] ~~Clientsidelogging (Application Insights)~~
   - [x] ~~Ikke logg noe for localhost~~
   - [x] ~~Feilhåndtering (vise side med feil når noe tryner)~~
  - [x] ~~Service worker med masse caching (da også offline)~~
  - [x] ~~Vise turrute i kartet~~
  - [x] ~~Mer informasjon i infoboblen på kartet~~
    - [x] ~~Antall besøk~~
    - [x] ~~Lengde~~
    - [x] ~~Stigning/Høydemeter~~
    - [x] ~~Vise turinfo - egen modal~~
  - [x] ~~Menyknapp med:~~
    - [x] ~~Mulighet for å registrere tur (med turfølge, gidder ikke dato)~~
      - [x] ~~Må dobbeltsjekke at tur har blitt registrert~~
    - [x] ~~Utlogging (noen som etterspurte dette, hurr)~~
    - [x] ~~Utlisting av topplisten for bedrift (spesielt innad i bedriften)~~
  - [x] ~~Vise i kart hvilke turer som er nye~~
  - [x] ~~Vise i kart hvilke turer som ikke er åpne enda~~


