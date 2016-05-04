var config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    moment = require('moment'),
    csv = require('csv');

console.log('You will probably want to run this as "node --max-old-space-size=8192 generate.js"');

var courseData = {};
var courseFile = fs.readFileSync('data/catalog_archive.csv');
csv.parse(courseFile.toString(), { columns : true, trim: true, relax: true}, function(error, data) {
  _.each(data, function(row) {
    if(typeof row !== 'undefined') {
      var course = {};
      _.each(row, function(value, key) {
        course[key.toLowerCase()] = value;
      });
      course.catalog_nbr = course.catalog_nbr.trim();
      if(typeof courseData[course.crse_id] === 'undefined') {
        courseData[course.crse_id] = {};
      }
      courseData[course.crse_id][course.term] = course;
    }
  });

  _.each(courseData, function(course) {
    var items = [];
    _.each(course, function(offer) {
      var index = offer.subject.toLowerCase() + '-' + offer.catalog_nbr.toLowerCase();
      if(items.indexOf(index) == -1) {
        items.push(index);
        fs.writeFile('_dist/courses/json/' + index + '.json', JSON.stringify(course));
      }
    });
  });
});
