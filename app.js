const mongoose = require('mongoose');
const express = require('express');
const PORT = 5000;
const app = express();

const bodyParser = require('body-parser');

// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MONGOOSE CONFIG
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://localhost/book_app', { useNewUrlParser: true });

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: String,
  author: String,
  description: String,
  image: String,
  date: { type: Date, default: Date.now }
});

const Book = mongoose.model('Book', bookSchema);

// Book.create({
//   title: 'The Glass Castle',
//   author: 'Jeanatte Walls',
//   description:
//     "Jeannette Walls grew up with parents whose ideals and stubborn nonconformity were both their curse and their salvation. Rex and Rose Mary Walls had four children. In the beginning, they lived like nomads, moving among Southwest desert towns, camping in the mountains. Rex was a charismatic, brilliant man who, when sober, captured his children's imagination, teaching them physics, geology, and above all, how to embrace life fearlessly. Rose Mary, who painted and wrote and couldn't stand the responsibility of providing for her family, called herself an excitement addict. Cooking a meal that would be consumed in fifteen minutes had no appeal when she could make a painting that might last forever.",
//   image:
//     'https://images-na.ssl-images-amazon.com/images/I/41qFdmnyvxL._SX314_BO1,204,203,200_.jpg'
// });

///////////////////////////////////////////////////////////////////////////////////
// Routes

// INDEX ROUTE
app.get('/', (req, res) => {
  res.redirect('/books');
});

app.get('/books', (req, res) => {
  Book.find({}, (err, allBooks) => {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { books: allBooks });
    }
  });
});

// NEW ROUTE
app.get('/books/new', (req, res) => {
  res.render('new');
});

// CREATE ROUTE
app.post('/books', (req, res) => {
  const { book } = req.body;
  Book.create(book, (err, newBook) => {
    if (err) {
      res.render('new');
    } else {
      res.redirect('/books');
    }
  });
});

// SHOW ROUTE
app.get('/books/:id', (req, res) => {
  const { id } = req.params;

  Book.findById(id, (err, foundBook) => {
    if (err) {
      res.redirect('/books');
    } else {
      res.render(`show`, { book: foundBook });
    }
  });
});

app.listen(PORT, () => {
  console.log('Book app server has started');
});
