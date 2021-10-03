#!/bin/bash
# Лоховской билд но пока нет вебпака пойдет
mkdir public/build 
handlebars public/static/js/content/templates/footer/*.handlebars -f footer.precompiled.js && mv footer.precompiled.js public/build/
handlebars public/static/js/content/templates/navigation/*.handlebars -f navigation.precompiled.js && mv navigation.precompiled.js public/build/
handlebars public/static/js/content/templates/productGrid/*.handlebars -f productGrid.precompiled.js && mv productGrid.precompiled.js public/build/
handlebars public/static/js/content/templates/productPath/*.handlebars -f productPath.precompiled.js && mv productPath.precompiled.js public/build/
handlebars public/static/js/content/templates/profileBlock/*.handlebars -f profileBlock.precompiled.js && mv profileBlock.precompiled.js public/build/