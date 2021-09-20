'use strict'
import { profilePage } from "./content/profilePage.js";
import { ModalWork } from "./modules/modal.js";
import { errorPage } from "./content/404Page.js";

const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
root.id = 'root';
root.classList.add('content');

ModalWork();
wrapper.appendChild(root);
createFooter();

mainPage();

const configApp = {
    menu: {
        href: '/',
        name: 'Меню',
        open: mainPage,
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

// создает футер
function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>© 2021. Volchock team</p>';
    wrapper.appendChild(footer);
}

// этот код нужен чтобы привязывать переход по ссылкам к функциям отрисовки, но он пока ломает ссылки без отрисовки типо logout
wrapper.addEventListener('click', e => {
    const { target } = e;

    if (target instanceof HTMLAnchorElement || target instanceof HTMLImageElement) {
        e.preventDefault();
        configApp[target.dataset.section].open();
    }
});