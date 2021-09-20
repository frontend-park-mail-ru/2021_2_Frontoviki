'use strict'
import { profilePage } from "./content/profilePage.js";
import { ModalWork } from "./modules/modal.js";

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
        open: mainPage,
    },
    error: {
        href: '/404',
        name: 'Ошибка',
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
                const {name, profilePic, rating} = JSON.parse(responseText);
                profile.render(name, rating, profilePic);
            }
        }
    });
}

// создает футер
function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>© 2021. Volchock team</p>';
    wrapper.appendChild(footer);
}


// wrapper.addEventListener('click', e => {
//     const { target } = e;
//     e.preventDefault();

//     if (target instanceof HTMLAnchorElement || target instanceof HTMLImageElement) {
//         e.preventDefault();

//         configApp[target.dataset.section].open();
//     }
// });

// отладочная фигня для перехода в профиль
Object
    .entries(configApp)
    .map(([key, { href, name }]) => {
        const menuElement = document.createElement('a');
        menuElement.href = href;
        menuElement.textContent = name;
        menuElement.dataset.section = key;

        return menuElement;
    })
    .forEach((el) => {
        root.appendChild(el);
});