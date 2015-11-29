var courses = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('keywords'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: '/data/courses.json'
});

$('#bloodhound .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'courses',
  display: 'title',
  source: courses
}).on('typeahead:render', function (e) {
  $('#bloodhound').find('.tt-selectable:first').addClass('tt-cursor');
  $('#bloodhound').find('.tt-selectable').on('mouseover', function (e) {
    $('#bloodhound').find('.tt-selectable:first').removeClass('tt-cursor');
  });
}).on('typeahead:selected', function (e, datum) {
  document.location.href += datum.url;
});
