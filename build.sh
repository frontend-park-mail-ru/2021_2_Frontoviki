#!/bin/bash
# Лоховской билд но пока нет вебпака пойдет
mkdir public/build 
handlebars public/static/js/content/templates/footer/*.handlebars -f footer.precompiled.js && mv footer.precompiled.js public/build/
handlebars public/static/js/content/templates/header/*.handlebars -f header.precompiled.js && mv header.precompiled.js public/build/
handlebars public/static/js/content/templates/modal/*.handlebars -f modal.precompiled.js && mv modal.precompiled.js public/build/
handlebars public/static/js/content/templates/productGrid/*.handlebars -f productGrid.precompiled.js && mv productGrid.precompiled.js public/build/
handlebars public/static/js/content/templates/infoBlock/productPath.handlebars -f productPath.precompiled.js && mv productPath.precompiled.js public/build/
handlebars public/static/js/content/templates/infoBlock/productSearch.handlebars -f productSearch.precompiled.js && mv productSearch.precompiled.js public/build/