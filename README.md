# WebPeli
## Tietoja projektista
Projekti tehtiin omasta kiinnostuksesta kokeilla pelin kehitystä selain alustalla ilman pelinkehitys moottoria.
Tarkoituksena kokeilla pelin upottamista Reactillä kehitettyyn verkkosivuun ja käyttää pilvipalveluita back endin teossa.
Peli on simppeli 2D-pulmapeli, jossa tarkoituksena päästä maaliin esteiden läpi mahdollisimman pienellä askelmäärällä.

Back end koostuu AWS Lambda funktioista ja Azure MySQL tietokannasta, joihin vain sovellus voi tehdä pyyntöjä.
Palveluihin lisätään autentikointia AWS IAM avulla ja Azuressa käytetään sertifikaatti tiedostoa autentikoimaan yhteydet.

## Front end
Front endissä peli toimii ilman tarvetta tehdä back end toimintoja, mutta käyttäjä toimintoihin tarvitaan back end.

1. Kloonaa repositorio
   git clone https://github.com/RamM21/WebPeli.git
2. Asenna riippuvuudet
   cd/webpeli
   npm install
3. pelaa peliä
   Avaa localhost:3000 verkkoselaimessa

## Back end
Back end toimintoihin tarvitaan AWS ja Azure käyttäjät tekemään tarvittavat toiminnot.
1. Luo Azure MySQL tietokanta
   - Ota yhteyd tietokantaan MySQL Workbenchillä
   - Avaa API kansiossa oleva tietokannan schema
   - Laita Workbench tekemään tietokanta
   - Lataa tietokannan sertifikaatti Azuresta
2. Luo zip kansio, joka sisältää
   - package.json, jossa asennettuna mysql ja bcryptjs
   - package-lock.json
   - node_modules
   - Azure sertifikaatti
3. Luo jokainen lambda funktiot
   - lisää index.js tiedosto ja kopioi API kansiosta koodi funktioihin
   - lisää funkion ympäristö muuttujiin tietokannan tiedot ja lue oma sertifikaatti tietokannan yhteyden tekoon
   - funktion url asetukset julkiseksi funktioksi suoraa toimintaa varten
   - lisää funktioiden julkiset url front end ympäristö muuttujiin
   
## Teknologiat
- React
- Node.JS
- MySQL

## Työkalut
- AWS Lambda
- Azure MySQL database
- MySQL Workbench


