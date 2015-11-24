var async = require('async');
var express = require('express');
var path = require('path');
var PCR = require('pcr');

var TOKEN = process.env.PCR_AUTH_TOKEN || 'public';
var pcr = new PCR(TOKEN);

var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/course/:courseId', (req, res) => {
  async.parallel({
    course: (callback) => pcr.courseHistory(req.params.courseId, callback),
    reviews: (callback) => pcr.averageReview(req.params.courseId, callback)
  }, (err, results) => {
    res.render('course', {
      course: results.course.result,
      reviews: results.reviews
    });
  });
});

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});
