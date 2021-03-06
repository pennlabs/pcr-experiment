var async = require('async');
var express = require('express');
var path = require('path');
var PCR = require('pcr');
var penn = require('penn-sdk');

var TOKEN = process.env.PCR_AUTH_TOKEN || 'public';
var pcr = new PCR(TOKEN);

var directory = new penn.Directory(
    process.env.DIRECTORY_API_USERNAME,
    process.env.DIRECTORY_API_PASSWORD
);

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
  pcr.instructor(req.params.instructorId, (err, instructor) => {
    directory.search({
      'first_name': instructor.result.first_name.split(' ')[0],
      'last_name': instructor.result.last_name,
      'affiliation': 'FAC'
    }, (penndir) => {
      res.render('instructor', {
        instructor: instructor.result,
        directory: penndir.result_data[0]
      });
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

app.locals.mostRecent = (history, attr) => {
  let lastCourse = history[history.length - 1];
  return parseFloat(lastCourse.ratings[attr]).toFixed(1);
};

app.locals.courseURL = (section) => {
  return section.split('-').slice(0, 2).join('-');
};

app.locals.dataArray = (history, attr) => {
  return JSON.stringify(history.map((i) => {
    return i.ratings[attr];
  }));
};

app.listen(app.get('port'), () => {
  console.log('Server running on port ' + app.get('port'));
});
