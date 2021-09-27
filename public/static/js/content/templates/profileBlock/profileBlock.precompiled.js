(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['profileBlock'] = template({"1":function(container,depth0,helpers,partials,data) {
    return "            <span class=\"active\"></span>\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "\n    <div class=\"profile-block\">\n        <h1>Профиль</h1>\n        <img src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"profilePic") || (depth0 != null ? lookupProperty(depth0,"profilePic") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profilePic","hash":{},"data":data,"loc":{"start":{"line":4,"column":18},"end":{"line":4,"column":32}}}) : helper)))
    + "\">\n        <div class=\"nickname\">"
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":5,"column":30},"end":{"line":5,"column":38}}}) : helper)))
    + "</div>\n        <div class=\"rating-result\">\n"
    + ((stack1 = (lookupProperty(helpers,"times")||(depth0 && lookupProperty(depth0,"times"))||alias2).call(alias1,(depth0 != null ? lookupProperty(depth0,"rating") : depth0),{"name":"times","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":7,"column":12},"end":{"line":9,"column":22}}})) != null ? stack1 : "")
    + "        </div>\n    <button id='reviews' class=\"profile-btn\">Отзывы</button>\n    <button id='ads' class=\"profile-btn\">Мои объявления</a>\n    <button id='my-reviews' class=\"profile-btn\">Мои отзывы</a>\n    <button id='fav' class=\"profile-btn\">Избранное</a>\n    <button id='messages' class=\"profile-btn\">Сообщения</button>\n    <button id='paid' class=\"profile-btn\">Платные услуги</button>\n    <button id='settings' class=\"profile-btn\">Настройки</button>\n    <button id='exit' class=\"profile-btn\">Выход</button>";
},"useData":true});
})();