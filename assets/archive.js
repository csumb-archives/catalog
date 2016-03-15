(function($) {
  $(document).ready(function() {
    clean.init();
    homepage.init();
  });

  var clean = {
    init: function() {
      this.unstyleNavigation();
      this.addNavLinks();
    },

    unstyleNavigation : function() {
      $('#catalog-archive-navigation ul').each(function() {
        $(this).addClass('list-unstyled');
      });
    },

    addNavLinks : function() {
      $.getJSON('/assets/config.json', function(data) {
        $.each(data, function(year, catalog) {
          $('#other-years').append('<li><a href="/' + year + '">' + this.longyear + '</a></li>');
        });
      });
    }
  };

  var homepage = {
    init: function() {
      if($('#catalog-archive-homepage').length) {
        this.addLinks();
      }
    },

    addLinks : function() {
      $.getJSON('/assets/config.json', function(data) {
        $.each(data, function(year, catalog) {
          $('#catalogs').append('<li><a href="/' + year + '">' + this.longyear + '</a>');
        });
      });
    }
  };
})(jQuery);
