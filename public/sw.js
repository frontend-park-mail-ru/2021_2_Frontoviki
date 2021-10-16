// const {assets} = global.serviceWorkerOption;,
const CACHE_NAME = 'volchockApp';

const cacheUrls = [
	'/',
	'./public/index.html',
	'./public/build/modal.precompiled.js',
	'./public/build/input.precompiled.js',
	'./public/build/productGrid.precompiled.js',
	'./public/build/productSearch.precompiled.js',
	'./public/build/footer.precompiled.js',
	'./public/build/header.precompiled.js',
	'./public/build/productPath.precompiled.js',
	'./public/static/js/constatns.js',
	'./public/static/js/views/profilePage.js',
	'./public/static/js/views/baseView.js',
	'./public/static/js/views/mainPage.js',
	'./public/static/js/views/404Page.js',
	'./public/static/js/templates/productGrid/productGrid.handlebars',
	'./public/static/js/templates/productGrid/productGrid.js',
	'./public/static/js/templates/productGrid/products.css',
	'./public/static/js/templates/footer/footer.js',
	'./public/static/js/templates/footer/footer.css',
	'./public/static/js/templates/footer/footer.handlebars',
	'./public/static/js/templates/infoBlock/productSearch.handlebars',
	'./public/static/js/templates/infoBlock/infoBlock.js',
	'./public/static/js/templates/infoBlock/info-block.css',
	'./public/static/js/templates/infoBlock/productPath.handlebars',
	'./public/static/js/templates/button/button.css',
	'./public/static/js/templates/header/header.js',
	'./public/static/js/templates/header/header.handlebars',
	'./public/static/js/templates/header/header.css',
	'./public/static/js/templates/input/input.js',
	'./public/static/js/templates/input/input.handlebars',
	'./public/static/js/templates/input/input.css',
	'./public/static/js/templates/modal/modal.js',
	'./public/static/js/templates/modal/modal.handlebars',
	'./public/static/js/templates/modal/modal.css',
	'./public/static/js/templates/easterEgg/easterEgg.css',
	'./public/static/js/templates/easterEgg/easterEgg.js',
	'./public/static/js/controllers/mainPageController.js',
	'./public/static/js/index.js',
	'./public/static/js/models/mainPage.js',
	'./public/static/js/modules/logout.js',
	'./public/static/js/modules/autorisation.js',
	'./public/static/js/modules/ajax.js',
	'./public/static/js/modules/registration.js',
	'./public/static/js/modules/clearInput.js',
	'./public/static/js/modules/Router.js',
	'./public/static/js/modules/isLogged.js',
	'./public/static/js/modules/EventBus.js',
	'./public/static/img/2spooky4me.jpg',
	'./public/static/img/icon.png',
	'./public/static/img/default_image.jpg',
	'./public/static/img/shpicz.jpg',
	'./public/static/img/avatar.jpeg',
	'./public/static/img/404.png',
	'./public/static/css/expand-menu.css',
	'./public/static/css/layout.css',
	'./public/static/css/404.css',
	'./public/static/css/variables.css',
];

self.addEventListener('install', (event) => {
	// задержим обработку события',
	// если произойдёт ошибка, serviceWorker не установится'
	event.waitUntil(
		// находим в глобальном хранилище Cache-объект с нашим именем'
		// если такого не существует, то он будет создан'
		caches.open(CACHE_NAME)
			.then((cache) => {
				// загружаем в наш cache необходимые файлы'
				return cache.addAll(cacheUrls);
			})
			.catch((err) => {
				console.error('smth went wrong with caches.open: ', err);
			})
	);
});

self.addEventListener('fetch', (event) => {
    event.respondWith((() => {
        if (navigator.onLine === true) {
            return fetch(event.request)
                .then((response) => {
                    if (event.request.method !== 'GET') {
                        return response;
                    }

                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseClone);
                        });

                    return response;
                });
        }
        return caches.match(event.request)
            .then((response) => {
                return response || new Response(null, {status: 500});
            });
    })());
});
