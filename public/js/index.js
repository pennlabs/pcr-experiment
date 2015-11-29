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
}).on('typeahead:selected', function (e, datum) {
  document.location.href += datum.url;
});
