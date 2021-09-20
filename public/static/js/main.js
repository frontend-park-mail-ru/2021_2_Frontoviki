'use strict'
import { profilePage } from "./content/profilePage.js";
import { ModalWork } from "./modules/modal.js";
import { errorPage } from "./content/404Page.js";
import { createFooter } from "./content/footer.js";
import { mainPage } from "./content/mainPage.js";

const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
root.id = 'root';
root.classList.add('content');

ModalWork();
wrapper.appendChild(root);
createFooter();

let ad = {
    href: '',
    src: "./static/img/2spooky4me.jpg",
    name: 'Картина',
    productPrice: "100$",
    location: "Москва"
}

let ad1 = {
    href: '',
    src: "./static/img/shpicz.jpg",
    name: 'Кек',
    productPrice: "100500$",
    location: "Ракетный завод"
}


main();

const configApp = {
    menu: {
        href: '/',
        name: 'Меню',
        open: main,
    },
    profile: {
        href: '/profile',
        name: 'Профиль',
        open: profile,
    },
    logout: {
        href: '/logout',
        name: 'Выйти',
        open: logout,
    },
    error: {
        href: '/404',
        name: 'Ошибка',
        open: err,
    }
}

function main() {
    let mainPg = new mainPage(root);
    mainPg.render('Новое', 'Картины', ['мышка', 'клавиатура', 'монитор'], ad, ad1, ad, ad, ad1);
}

function profile() {
    Ajax.ajaxGet({
        url: '/me',
        body: null,
        callback: (status, responseText) => {
            let isAuthorized = false;

            if (status === 200) {
                isAuthorized = true;
            }
            if (isAuthorized) {
                const profile = new profilePage(root);
                const { name, profilePic, rating } = JSON.parse(responseText);
                profile.render(name, rating, profilePic);
            }
        }
    });
}

function logout() {
    let promise = new Promise(function (resolve, reject) {
        Ajax.ajaxGet({
            url: '/logout',
            body: null,
        });
        resolve('done');
    });
    promise.then(ModalWork);
    mainPage();
}

function err() {
    const err = new errorPage(root);
    err.render();
}


// этот код нужен чтобы привязывать переход по ссылкам к функциям отрисовки, но он пока ломает ссылки без отрисовки типо logout
wrapper.addEventListener('click', e => {
    const { target } = e;

    if (target instanceof HTMLAnchorElement || target instanceof HTMLImageElement) {
        e.preventDefault();
        configApp[target.dataset.section].open();
    }
});