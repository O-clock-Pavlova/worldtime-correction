// Dans cette application nous allons utiliser express
// il faut donc l'importer
const express = require('express');

// On importe dayjs qui nous sera utile pour 
// traiter les dates et l'heure
const dayjs = require('dayjs');
const relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);

// on défini la locale française
// pour que la date soit écrite en français
require('dayjs/locale/fr');
// On change la locale de dayjs
dayjs.locale('fr');

// On importe timezone qui va nous permettre 
// de gérer les décalage horaires des différentes capitales
const utc = require('dayjs/plugin/utc'); // dependent on utc plugin
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// puis l'initialiser
let app = express();

// on choisi le port pour le serveur web
let port = 3000;

// on défini la route de l'index
app.get('/', (req, res) => {

    // on lit le fichier index.html
    // on demande l'affichage du contenu a express
    res.sendFile(__dirname + '/views/index.html');
});

// on défini les routes pour l'affichage de informations des capitales
// la route contien un paramètre cityName
app.get('/city/:cityName', (req, res) => {

    // on charge le module capitales 
    // qui contient la liste des capitales disponibles
    const capitalCities = require('./my_modules/capitalCities');

    // on initialise la variable qui contiendra la capitale courante
    let foundCapitalCity;

    // Il nous faut récupérer l'objet de la capitale envoyé en paramètre

    // #oldSchool
    // on boucle sur le tableau d'objet
    // et on vérifie si le nom correspond a celui envoyé en paramètre
    //for (iCapitale in capitales) {
    //    if (capitales[iCapitale].name.toLowerCase() == req.params.cityName.toLowerCase()) {
    //        currentCity = capitales[iCapitale];
    //    }
    //}

    // #New #stylé
    // on filtre le tableau avec comme condition 
    // que le nom de la capitale corresponde a celui envoyé en paramètre, 
    // puis on récupère l'élément avec pop
    foundCapitalCity = capitalCities.find((city) => city.name.toLowerCase() == req.params.cityName.toLowerCase());

    console.log(foundCapitalCity);
    // on défini et on formate le jour et l'heure de la capitale
    let day = dayjs().tz(foundCapitalCity.tz).format("dddd Do MMMM YYYY");
    let hour = dayjs().tz(foundCapitalCity.tz).format("H:mm:ss");

    // On écrit notre page html de retour
    res.send(`
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Heure à ${foundCapitalCity.name}</title>
                    </head>
                    <body>
                        À ${foundCapitalCity.name} nous sommes le ${day} et il est ${hour}
                    </body>
                </html>
            `);

});

// On créer le serveur web sur le port choisi
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
