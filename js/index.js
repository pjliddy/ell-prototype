'use strict'

// store global page data

let pageData;

// document ready

$(function() {
  renderPage('/data/content.json', 'js/templates/body.hbs');
});

// get page data and render page template

function renderPage(dataSrc, templateSrc) {
  getPageData(dataSrc)
    .then((data) => {
      // store global page data
      pageData = data;

      // get template and render
      getTemplate('js/templates/body.hbs')
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

// render template and prepend target element

function prependTemplate(target, source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  $(target).prepend(content)
}








// render template and insert in target element

function renderTemplate(source, data) {
  const template  = Handlebars.compile(source)
  const content = template({data:data})
  return content
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
