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
    reviews: (callback) => pcr.averageReview(req.params.courseId, callback),
    historyReviews: (callback) => pcr.courseHistoryReviews(req.params.courseId, callback)
  }, (err, results) => {
    var history = results.historyReviews.result.values;
    var comments;
    history.forEach((c) => {
      if (c.comments && c.comments.length > 0) {
        comments = c.comments;
      }
    });
    res.render('course', {
      course: results.course.result,
      reviews: results.reviews,
      comments: comments
    });
  });
});

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});
