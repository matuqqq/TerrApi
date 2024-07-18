var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.json());
var items = require('./public/items.js')
var tables = require('./public/tables.js')

app.get('/items/:id', (req, res) => {
  res.json(items.items[req.params.id-1]);
})

app.get('/tables/:id', (req, res) => {
  res.json(tables.tables[req.params.id-1]);
})

app.use((req, res, next) => {
  res.status(404);
  res.type('txt').send('Not found');
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }
})


app.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
