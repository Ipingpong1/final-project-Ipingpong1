import express, { urlencoded } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import './db.mjs';
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
mongoose.connect(process.env.DSN);

const Card = mongoose.model('Card');
const Deck = mongoose.model('Deck');
const User = mongoose.model('User');

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) =>{
    res.render('main');
});

app.get('/login', (req, res) =>{
    res.render('login');
});

app.get('/register', (req, res) =>{
    res.render('register');
});

app.get('/search', (req, res) =>{
    fetch("https://api.scryfall.com/cards/named?fuzzy=smugglers+copter").then((response) => {
        response.json().then((body) => {
            res.render('search', {card: body["oracle_text"], cardImage: "https://cards.scryfall.io/normal/front/2/6/2680ed41-da35-475a-9d80-ae2f4686feed.jpg?1707764737"})

        });
    });
});

app.post('/search', (req, res) =>{
    const searchedCardName = req.body["cardName"];
    const searchedCardName_headered = searchedCardName.replaceAll(' ', '+')
    fetch("https://api.scryfall.com/cards/named?fuzzy="+searchedCardName_headered).then((response) => {
        response.json().then((body) => {
            const cardImageUrl = body["image_uris"]["normal"];
            const cardPrice = body["prices"]["usd"];
            const cardPrice_foil = body["prices"]["usd_foil"];
            const buyUri = body["purchase_uris"]["tcgplayer"]
            res.render('search', {
                 card: `Oracle text (unformatted): ${body["oracle_text"]}`,
                 cardImage: cardImageUrl, 
                 price: cardPrice, 
                 price_foil: cardPrice_foil, 
                 tcglink: buyUri
                });

            const c = new Card({
                name: searchedCardName,
                manaCost: 100101, //WUBRGC
                format: 0,
                printing: "KLD",
                image: cardImageUrl
            })
            c.save()

        });
    });
});

console.log("Starting...")
app.listen(process.env.PORT || 3000);
