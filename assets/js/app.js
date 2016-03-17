define(function(require) {
  var $ = require('jquery');
  var courses = require('courses');
  $(document).ready(function() {
    courses.init();
  })
});
