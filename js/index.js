'use strict'

//
// GitHub Repository: https://github.com/pjliddy/ell-prototype
// GitHub Pages: https://pjliddy.github.io/ell-prototype/
//
// to publish to GitHub Pages:
// git subtree push --prefix dist origin gh-pages
//

// document ready

$(function() {
  setupTemplates();
  renderPage('data/content.json', 'js/templates/body.hbs');
});

// setup Handlebars partials

function setupTemplates() {
  // TODO: refactor to iterate through files in js/templates/*.hbs
  
  registerPartials([
    'content-aside',
    'content-main',
    'footer',
    'header',
    'hero',
    'nav-panel',
    'ratings',
    'share',
    'support',
    'tab-panel-about',
    'tab-panel-activity',
    'tab-panel-comments',
    'tab-panel-examples',
    'tab-panel-notes',
    'tab-panels',
    'video'
  ]);
}

// Handlebars helpers

Handlebars.registerHelper('getTabPanel', function (type, context) {
  var partial = Handlebars.partials['tab-panel-' + type];
  if (typeof partial !== 'function') {
    partial = Handlebars.compile(partial);
  }
  return partial(context); // build up the context some how
});

Handlebars.registerHelper("isEqual", function(conditional, options) {
  if (options.hash.value === conditional) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

// register Handlebars partials

function registerPartials(partials) {
  partials.forEach( name => {
    getTemplate(`js/templates/${name}.hbs`)
      .then((source) => {
         Handlebars.registerPartial(name, source);
      })
      .fail((err) => console.log(`${name} is not available`))
  })
}

// get page data and render page template

function renderPage(dataSrc, templateSrc) {
  getPageData(dataSrc)
    .then((data) => {
        // get template and render
      getTemplate('js/templates/body.hbs')
        .then((templateSrc) => {
          prependTemplate('body', templateSrc, data)
        })
        .fail((err) => console.log('template is not available'))
    })
    .fail((err) => console.log('data not available'))
}

// make AJAX call to page data JSON file and return promise

function getPageData(source) {
  return $.ajax({
    url: source,
    cache: true
  })
}

// make AJAX call to Handlebars template file and return promise

function getTemplate (path) {
  return $.ajax({
    url: path,
    cache: true
  })
}

// render template and insert in target element

function renderTemplate(source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  return content
}

// render template and prepend target element

function prependTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data})
  $(target).prepend(content)
}
