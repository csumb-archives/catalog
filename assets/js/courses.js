define(function(require) {
  var $ = require('jquery');
  var Handlebars = require('handlebars');

  return {

    regex : /[A-Z]{2,} [0-9]{2,}(\/?)([A-Z]?)/,

    term : '',

    $scope : $('#catalog-archive-content'),

    modalTemplate : '',

    init : function() {
      var that = this;
      this.term = $('body').data('term');
      this.prepareModal();
      this.fixNewCatalogLinks();
      /*$('.catalog-archive-content a:not(.catalog-tip)').each(function() {
        that.removeCourseLink($(this));
      });
      $('.catalog-archive-content *').each(function() {

      });*/
      this.bindLinks();
    },

    prepareModal : function() {
      var source   = $("#template-course-modal").html();
      this.modalTemplate = Handlebars.compile(source);
      $('body').append('<div id="temp-course-modal">');
    },

    fixNewCatalogLinks : function() {
      this.$scope.find('a.catalog-tip').each(function() {
        if($(this).attr('id')) {
          var $newLink = $('<a>');
          $newLink.attr('href', '/courses/json/' + $(this).attr('id').toLowerCase() + '.json')
                 .addClass('course-link')
                 .html($(this).text());
          $(this).replaceWith($newLink);
        }
      });
    },

    bindLinks : function() {
      var that = this;
      this.$scope.find('a.course-link').on('click', function(event) {
        event.preventDefault();
        $.getJSON($(this).attr('href'), function(data) {
          var html = that.modalTemplate(data[2164]);
          $('#temp-course-modal').html(html);
          $('#temp-course-modal .modal').modal('show');
        });
      });
    },

    removeCourseLink : function($a) {
      if($a.attr('href').search(this.regex)) {
        $a.after($a.text());
        $a.remove();
      }
    }
  };
});
