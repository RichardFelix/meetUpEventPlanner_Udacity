var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.set('view engine', 'jade');
app.set('views', 'src/views/');
app.use(express.static('src/public/'));
// app.locals.pretty = true;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('*', (req, res) =>{
  res.render('index');
});

app.listen(port, ()=>{
  console.log(`app running on port ${port}`);
});
