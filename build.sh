#!/bin/bash
# Лоховской билд но пока нет вебпака пойдет
mkdir public/build 
handlebars public/static/js/templates/footer/*.handlebars -f footer.precompiled.js && mv footer.precompiled.js public/build/
handlebars public/static/js/templates/header/*.handlebars -f header.precompiled.js && mv header.precompiled.js public/build/
handlebars public/static/js/templates/modal/*.handlebars -f modal.precompiled.js && mv modal.precompiled.js public/build/
handlebars public/static/js/templates/modal/*.handlebars -f input.precompiled.js && mv input.precompiled.js public/build/
handlebars public/static/js/templates/profileInfoBlock/*.handlebars -f profileInfoBlock.precompiled.js && mv profileInfoBlock.precompiled.js public/build/
handlebars public/static/js/templates/easterEgg/*.handlebars -f easterEgg.precompiled.js && mv easterEgg.precompiled.js public/build/
handlebars public/static/js/templates/settings/*.handlebars -f settings.precompiled.js && mv settings.precompiled.js public/build/


handlebars public/static/js/templates/productGrid/*.handlebars -f productGrid.precompiled.js && mv productGrid.precompiled.js public/build/
handlebars public/static/js/templates/infoBlock/productPath.handlebars -f productPath.precompiled.js && mv productPath.precompiled.js public/build/
handlebars public/static/js/templates/infoBlock/productSearch.handlebars -f productSearch.precompiled.js && mv productSearch.precompiled.js public/build/