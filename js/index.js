'use strict'
Handlebars.logger.level = 0;

// store global page data

let pageData;

// document ready

$(function() {
  setupTemplates();
  renderPage('/data/content.json', '/js/templates/body.hbs');
});

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


// setup Handlebars partials

function setupTemplates() {
  // refactor to iterate through files in js/templates/*.hbs
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

function registerPartials(partials) {
  partials.forEach( name => {
    getTemplate(`/js/templates/${name}.hbs`)
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
      // store global page data
      pageData = data;

      // console.log(pageData);

      // get template and render
      getTemplate('/js/templates/body.hbs')
        .then((templateSrc) => {
          prependTemplate('body', templateSrc, pageData)
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









// render template and replace target element

function replaceTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  $(target).html(content)
}

// render template and append to target element

function appendTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  $(target).append(content)
}

// clear element from DOM

function removeTemplate(target) {
  $(target).remove()
}
