define(function(require) {
  var $ = require('jquery');
  var Handlebars = require('handlebars');

  return {

    regex : /[A-Z]{2,} [0-9]{2,}(\/?)([A-Z]?)/g,

    term : '',

    $scope : $('#catalog-archive-content'),

    modalTemplate : '',

    init : function() {
      var that = this;
      this.term = $('body').data('term');
      this.prepareModal();
      this.bindLinks();
    },

    prepareModal : function() {
      var source   = $('#template-course-modal').html();
      this.modalTemplate = Handlebars.compile(source);
      $('body').append('<div id="temp-course-modal">');
    },

    bindLinks : function() {
      var that = this;
      this.$scope.find('a.course-link').on('click', function(event) {
        event.preventDefault();
        $.getJSON($(this).attr('href'), function(data) {
          var html = that.modalTemplate(data[that.term]);
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
