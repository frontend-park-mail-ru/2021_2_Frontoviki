(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['productPath'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<ul>\n  <li><a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"categoryHref") || (depth0 != null ? lookupProperty(depth0,"categoryHref") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"categoryHref","hash":{},"data":data,"loc":{"start":{"line":2,"column":15},"end":{"line":2,"column":31}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"category") || (depth0 != null ? lookupProperty(depth0,"category") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"category","hash":{},"data":data,"loc":{"start":{"line":2,"column":33},"end":{"line":2,"column":45}}}) : helper)))
    + "</a></li>\n  <li><a href=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"subCategoryHref") || (depth0 != null ? lookupProperty(depth0,"subCategoryHref") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subCategoryHref","hash":{},"data":data,"loc":{"start":{"line":3,"column":15},"end":{"line":3,"column":34}}}) : helper)))
    + "\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"subCategory") || (depth0 != null ? lookupProperty(depth0,"subCategory") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subCategory","hash":{},"data":data,"loc":{"start":{"line":3,"column":36},"end":{"line":3,"column":51}}}) : helper)))
    + "</a></li>\n</ul>";
},"useData":true});
})();