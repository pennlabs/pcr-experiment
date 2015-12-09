'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var courses = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('keywords'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: '/data/courses.json'
});

$('#bloodhound .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
}, {
  name: 'courses',
  display: 'title',
  source: courses
}).on('typeahead:render', function (e) {
  $('#bloodhound').find('.tt-selectable:first').addClass('tt-cursor');
  // Remove cursor when manually selecting items
  $('#bloodhound').find('.tt-selectable').on('mouseover', function (e) {
    $('#bloodhound').find('.tt-selectable:first').removeClass('tt-cursor');
  });
}).on('typeahead:selected', function (e, datum) {
  document.location.href += datum.url;
});

var Course = (function (_React$Component) {
  _inherits(Course, _React$Component);

  function Course() {
    _classCallCheck(this, Course);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Course).apply(this, arguments));
  }

  _createClass(Course, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { className: 'courses' },
        'Found ',
        this.props.courses.length,
        ' courses'
      );
    }
  }]);

  return Course;
})(React.Component);
