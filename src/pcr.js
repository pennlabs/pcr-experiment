var express = require('express');
var path = require('path');
var PCR = require('pcr');

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});
