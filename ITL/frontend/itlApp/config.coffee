exports.config =
  # See docs at https://github.com/brunch/brunch/blob/stable/docs/config.md.
  conventions:
    assets:  /^app\/assets\//
    ignored: /^(bower_components\/bootstrap-less(-themes)?|app\/styles\/overrides|(.*?\/)?[_]\w*)/
  modules:
    definition: false
    wrapper: false
  paths:
    public: '_public'
  files:
    javascripts:
      joinTo:
        'js/app.js': /^app/
        'js/vendor.js': /^(bower_components|vendor)/
      order:
        before: [
          'bower_components/jquery/jquery.js',
          'bower_components/angular/angular.js',
          'bower_components/underscore/underscore.js'
        ]

    stylesheets:
      joinTo:
        'css/app.css': /^(app|vendor|bower_components)/
      order:
        after: [
          'app/styles/app.less'
        ]

    templates:
      joinTo: 'js/app.js'

  # Enable or disable minifying of result js / css files.
  # minify: true
