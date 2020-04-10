const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

//define paths for express configuration
const publicDirectory = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//static directory to serve
app.use(express.static(publicDirectory));

//setup handlebars engine and views path
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

//route to the index/home page
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather Application',
    h1: 'am using handlebars to render this to the browser',
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

//route to the about page
app.get('/about', (req, res) => {
  res.render('about', {
    title: 'about',
    h1: 'This is the about page',
    imgName: 'haroldInProvidence',
  });
});

//route to the help page
app.get('/help', (req, res) => {
  res.render('help', {
    title: 'help',
    message: 'hold on help is on the way',
  });
});

//route to the weather page
app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'please provide an address on the query string',
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMessage: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    errorMessage: 'Page Not Found',
  });
});

//specify which port to listen on
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
