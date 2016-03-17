requirejs.config({
    baseUrl: '/assets/js',
    paths: {
        jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min',
        bootstrap: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min',
        handlebars: 'https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/4.0.5/handlebars.min'
    },
    shim: {
      bootstrap : {
        deps : [
          'jquery'
        ]
      }
    }
});

require(['jquery', 'bootstrap', 'app']);
