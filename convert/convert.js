var config = require('../_dist/_data/catalog'),
    fs = require('fs'),
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

_.each(config, function(catalog) {
  var year = catalog.year
  if(!catalog.navigation) {
    var navigationFile = fs.readFileSync(catalog.navigationFile);
  }
  if(typeof process.argv[2] !== 'undefined' && year != process.argv[2]) {
    return;
  }
  console.log('Processing ' + year);
  var walker = walk.walk('../src/' + year, { followLinks : false });
  walker.on("file", function(root, fileStat, next) {
    if(fileStat.name.search('.html') > -1) {
      var outpath = path.resolve(root, fileStat.name).replace('archive/src/', 'archive/_dist/');
      var relativeFile = outpath.split('_dist/' + year +'/');
      fs.readFile(path.resolve(root, fileStat.name), function (err, data) {
        if(!err) {
          $ = cheerio.load(data);
          if(!catalog.navigation) {
            $('body').append('<div id="_temp-nav">' + navigationFile + '</div>');
          }
          $('img, .book-navigation, .view-major-careers, .pane-major-careers').remove();
          $('[bgcolor]').each(function() {
            $(this).removeAttr('bgcolor');
          });
          $('a').each(function() {
            var text = $(this).text().replace(/\s\s+/g, ' ');
            var match = text.match(courseRegex);
            if(!match) {
              return;
            }
            $(this).replaceWith($(this).text().replace(/\s\s+/g, ' '));
          });
          $('*').each(function() {
            $(this).removeAttr('style');
          });

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

          var title = $('head title').first().text();
          title = title.replace(catalog.titlePrefix, '').replace(/\s\W+/g, ' ').replace(':', '&#58;').trim();
          var content = $(catalog.content).html();
          if(catalog.navigation) {
            var navigation = $(catalog.navigation);
            navigation.removeClass('nav').removeClass('navbar-nav');
            naviation = navigation.html();
          }
          else {
            var navigation = $('#_temp-nav').html();
          }
          var frontmatter = {
            layout: 'archive',
            title:  title,
            year:  year,
            term:  catalog.term,
            longyear: catalog.longyear,
            path: relativeFile[1].replace(/\r/, '')
          };
          var pageContent = ['---',
            YAML.stringify(frontmatter, 2),
            '---',
            '<div class="row">',
            '<div class="col-md-8" id="catalog-archive-content">',
            content,
            '</div>',
            '<div class="col-md-3" id="catalog-archive-navigation">',
            navigation,
            '</div>',
            '</div>'].join("\n");
            mkdirp(path.dirname(outpath), function (err) {
              if (err) return cb(err);
              fs.writeFile(outpath, pageContent, function(err) {
                console.log('Generated ' + outpath + ' from ' + path.resolve(root, fileStat.name));
              });
            });
          }
        });
      }
      next();
    });
  });
