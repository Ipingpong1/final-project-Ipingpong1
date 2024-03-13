import mongoose from 'mongoose'

// An object representing a single card through its name, manacost, format, and specific printing version.
const Card = new mongoose.Schema({
    name: {type: String, required: true},
    manaCost: {type: Number, min: 1, required: true},
    format: {type: Number, min: 0, required: true},
    printing: {type: String, required: true}
  }, {
    _id: true
});

// An object representing a single 60 card deck through its name, creation date, format, cards, and price
// * Each deck is a collection of card objects.
const Deck = new mongoose.Schema({
    name: {type: String, required: true},
    createdAt: {type: Date, required: true},
    cards: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Card' } ],
    format: {type: String, required: true},
    price: {type: Number, required: false} // false as the price is calculated after deck is created
  });

// Users
// * Site requires authentication to maintain accounts
// * Users have a username and password
// * User objects will store the user's decks and collection
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  collection:  [ { type: mongoose.Schema.Types.ObjectId, ref: 'Card' } ],
  decks:  [ { type: mongoose.Schema.Types.ObjectId, ref: 'Deck' } ]
});
