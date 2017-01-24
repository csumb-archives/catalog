var fs = require('fs'),
    path = require('path'),
    walk = require('walk'),
    _ = require('underscore'),
    cheerio = require('cheerio'),
    tidy = require('htmltidy').tidy,
    shortid = require('shortid'),
    md5 = require('md5'),
    YAML = require('yamljs');
    mkdirp = require('mkdirp');

var courseRegex = /[A-Z]{2,} [0-9]{2,}(\/?)([A-Z]?)/g;

var walker = walk.walk('../fall2016', { followLinks : false });
walker.on("file", function(root, fileStat, next) {
  var outpath = path.resolve(root, fileStat.name).replace('fall2016', '_fall2016');
  console.log(outpath);
  fs.readFile(path.resolve(root, fileStat.name), function (err, data) {
    var front = [];
    var count = 0;
    split = data.toString().split("\n");
    _.each(split, function(item) {
      if(count < 2) {
        front.push(item);
      }
      if(item == '---') {
        count++;
      }
    });
    $ = cheerio.load(data);
    $('p, li, td').each(function() {
      var match = $(this).text().replace(/\s\s+/g, ' ').match(courseRegex);
      if(!match) {
        return;
      }
      var $that = $(this);
      _.each(match, function(courseText) {
        var course = courseText.trim().split(' ');
        if(course.length != 2) {
          return;
        }
        var subject = course[0].toLowerCase();
        var number = course[1].toLowerCase();
        $that.html($that.html().replace(/\s\s+/g, ' ').replace(courseText, '<a href="/courses/json/' + subject + '-' + number + '.json" class="course-link" >' + courseText + '</a>'));
      });
    });
    var content = $('*').html();
    content = front.join("\n") + content;
    mkdirp(path.dirname(outpath), function (err) {
      if (err) return cb(err);
      fs.writeFile(outpath, content, function(err) {
        console.log('Generated ' + outpath + ' from ' + path.resolve(root, fileStat.name));
      });
    });
  });

  next();
});
