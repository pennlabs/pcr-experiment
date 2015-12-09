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
    if (!comments) {
      comments = 'No qualitative comments available for this course.';
    }
    res.render('course', {
      course: results.course.result,
      reviews: results.reviews,
      comments: comments,
      history: history
    });
  });
});

app.get('/instructor/:instructorId', (req, res) => {
  async.parallel({
    instructor: (callback) => pcr.instructor(req.params.instructorId, callback)
  }, (err, results) => {
    res.render('instructor', {
      instructor: results.instructor.result
    });
  });
});

app.get('/department/:department', (req, res) => {
  async.parallel({
    department: (callback) => pcr.department(req.params.department, callback)
  }, (err, results) => {
    let courses = results.department.result.coursehistories;
    courses.sort((a, b) => a.aliases[0].localeCompare(b.aliases[0]));
    res.render('department', {
      department: results.department.result,
      courses: courses
    });
  });
});

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});
