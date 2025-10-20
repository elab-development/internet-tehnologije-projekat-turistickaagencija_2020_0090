Projekat za predmet Internet tehnologije

KRATAK OPIS APLIKACIJE

Ova aplikacija namenjena je za upravljenje turističkim aranžmanima i destinacijama, sa posebnim funkcionalnostima za klijente, agente i administratore. Korišćenjem React-a za frontend i axios biblioteke za HTTP zahteve, aplikacija omogućava jednostavan i intuitivan način za pregled i upravljanje aranžmanima kao i za njihovu rezervaciju.

Uputstvo za preuzimanje

Instalacija
Za potrebe ovog projekta je potrebno instalirati sledeće:
git
laravel (composer..)
node js
xampp
vs code

Preuzimanje projekta

  git clone https://github.com/elab-development/internet-tehnologije-projekat-turistickaagencija_2020_0090.git

Pokretanje laravel projekta
  cd laravelapp
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate:fresh --seed
  php artisan serve
  
Pokretanje react projekta
cd reactapp
npm install
npm start