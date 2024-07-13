var fs = require('fs');
var express = require('express');
var app = express();


app.get('/items/:id',(req,res) =>{
res.sendFile("./public/items/"+ req.params.id +".json");
})

app.get('/recipes/:id',(req,res) =>{
    res.sendFile("./public/recipes/"+ req.params.id +".json");
    })

app.get('/tables/:id',(req,res) =>{
    res.sendFile("./public/tables/"+ req.params.id +".json");
    })

app.use((req, res, next) =>{
  res.status(404);
  res.type('txt').send('Not found');
});

app.use((err, req, res, next) => {
  if(err) {
    res.status(err.status || 500)
      .type('txt')
      .send(err.message || 'SERVER ERROR');
  }  
})


app.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});
