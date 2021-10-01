(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['footer'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        <footer>\n            <p> "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"footerText") || (depth0 != null ? lookupProperty(depth0,"footerText") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"footerText","hash":{},"data":data,"loc":{"start":{"line":2,"column":16},"end":{"line":2,"column":32}}}) : helper)))
    + " </p>\n        </footer>";
},"useData":true});
})();