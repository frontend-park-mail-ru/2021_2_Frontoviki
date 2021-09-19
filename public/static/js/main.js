'use strict'
const wrapper = document.querySelector('.wrapper');
const root = document.createElement('div');
root.id = 'root';
root.classList.add('content');

createHeader();
wrapper.appendChild(root);
createFooter();

const configApp = {
    menu: {
        href: '/',
        name: 'Меню',
        open: mainPage,
    },
    profile: {
        href: '/profile',
        name: 'Профиль',
        open: profilePage,
    },
}

mainPage();
createModal();

function createHeader() {
    const header = document.createElement('header');
    const nav = document.createElement('nav');
    nav.classList.add('nav_menu');

    const subnav = document.createElement('ul');
    subnav.classList.add('sub_nav_menu');

    const el1 = document.createElement('li');
    el1.classList.add('main_elements');
    const brand = document.createElement('a');
    brand.href = './index.html';
    brand.innerHTML = 'Volchock';
    el1.appendChild(brand);
    subnav.appendChild(el1);

    const el2 = document.createElement('li');
    el2.classList.add('main_elements');
    const newAd = document.createElement('a');
    newAd.href = './404.html';
    newAd.innerHTML = 'Создать объявление';
    el2.appendChild(newAd);
    subnav.appendChild(el2);


    if (true) {
        const el3 = document.createElement('li');
        el3.classList.add('main_elements');
        const login = document.createElement('a');
        login.id = 'auth';
        login.href = '';
        login.innerHTML = 'Войти';
        el3.appendChild(login);
        subnav.appendChild(el3);
    }
    else {
        const profile = document.createElement('li');
        profile.classList.add('dropdown');
        profile.classList.add('dropdown-9');
        profile.innerHTML = 'Профиль';

        const menu = document.createElement('ul');
        menu.classList.add('dropdown_menu');
        menu.classList.add('dropdown_menu--animated');
        menu.classList.add('dropdown_menu-9');

        const content = document.createElement('li');
        content.classList.add("dropdown_item");

        const imgref = document.createElement('a');
        imgref.href = '#';

        const img = document.createElement('img');
        img.src = 'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg';
        imgref.appendChild(img);
        content.appendChild(imgref);

        const logout = document.createElement('li');
        logout.classList.add("logout_item");

        const logoutBtn = document.createElement('a');
        logoutBtn.href = '/logout';
        logoutBtn.innerHTML = 'Выход';

        logout.appendChild(logoutBtn);

        menu.appendChild(content);
        menu.appendChild(logout);
        profile.appendChild(menu);
        subnav.appendChild(profile);
    }
    nav.appendChild(subnav);
    header.appendChild(nav);
    wrapper.appendChild(header);
}

// создает футер
function createFooter() {
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>© 2021. Volchock team</p>';
    wrapper.appendChild(footer);
}

// создает модальное
function createModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal-window');

    const socials = document.createElement('div');
    socials.classList.add('socials');

    socials.innerHTML = `<h1>Connect with</h1>
                        <div>
                            <a href="#">VK</a>
                            <a href="#">Google</a>
                            <a href="#">Another way</a>
                        </div>`;
    modal.appendChild(socials);

    const loginView = document.createElement('div');
    loginView.id = 'modal-login-form';
    const entry = document.createElement('h1');
    entry.innerHTML = 'Войти';
    loginView.appendChild(entry);

    const logForm = document.createElement('form');

    const email = document.createElement('input');
    email.type = 'email';
    email.name = 'email';
    email.placeholder = 'Email';
    logForm.appendChild(email);

    const password = document.createElement('input');
    password.type = 'password';
    password.name = 'password';
    password.placeholder = 'Пароль';
    logForm.appendChild(password);

    const btn = document.createElement('input');
    btn.type = 'submit';
    btn.value = 'Войти';
    logForm.appendChild(btn);

    const reg = document.createElement('a');
    reg.href = '';
    reg.id = 'mf-login_to_signup';
    reg.innerHTML = 'Регистрация';
    logForm.appendChild(btn);
    logForm.appendChild(reg);

    loginView.appendChild(logForm);


    const regView = document.createElement('div');
    regView.id = 'modal-signup-form';
    regView.classList.add('mf-unactive');
    const regText = document.createElement('h1');
    regText.innerHTML = 'Регистрация';
    regView.appendChild(regText);

    const regForm = document.createElement('form');

    const name = document.createElement('input');
    name.type = 'name';
    name.placeholder = 'Имя';
    regForm.appendChild(name);

    const emailR = document.createElement('input');
    emailR.type = 'email';
    emailR.name = 'email';
    emailR.placeholder = 'Email';
    regForm.appendChild(emailR);

    const passwordR = document.createElement('input');
    passwordR.type = 'password';
    passwordR.name = 'password';
    passwordR.placeholder = 'Пароль';
    regForm.appendChild(passwordR);

    const passwordRepR = document.createElement('input');
    passwordRepR.type = 'password';
    passwordRepR.name = 'password';
    passwordRepR.placeholder = 'Повторите Пароль';
    regForm.appendChild(passwordRepR);

    const btnR = document.createElement('input');
    btnR.type = 'submit';
    btnR.value = 'Регистрация';
    regForm.appendChild(btnR);

    const ent = document.createElement('a');
    ent.href = '';
    ent.id = 'mf-signup_to_login';
    ent.innerHTML = 'Вход';
    regForm.appendChild(ent);

    regView.appendChild(regForm);

    modal.appendChild(regView);
    modal.appendChild(loginView);
    const black = document.createElement('div');
    black.classList.add('blackout');

    root.appendChild(modal);
    root.appendChild(black);
}


root.addEventListener('click', e => {
    const { target } = e;
    console.log(target.dataset.section);

    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();

        configApp[target.dataset.section].open();
    }
});

////////////// функции модального окна помогите разбить на модули :(

const modalWindow = document.querySelector('.modal-window');
const blackout = document.querySelector('.blackout');
blackout.addEventListener('click', e => {
    e.preventDefault();

    modalWindow.classList.remove('active');
    blackout.classList.remove('active');

    const listener = function (e) {
        modalWindow.removeEventListener('webkitTransitionEnd', listener, false);
    }
    modalWindow.addEventListener('webkitTransitionEnd', listener, false);
});


// Добавляем возможность показывать модальное окно по клику по ссылке в хэдере
const authLink = document.getElementById('auth');
authLink.addEventListener('click', e => {
    e.preventDefault();

    replaceAuthForms('login');

    modalWindow.classList.add('active');
    blackout.classList.add('active');
});


// Добавляем возможность изменять форму логина на форму регистрации по клику по ссылке модального окна
const loginToSignupAnchor = document.getElementById('mf-login_to_signup');
loginToSignupAnchor.addEventListener('click', e => {
    e.preventDefault();
    replaceAuthForms('signup');
});


// Добавляем возможность изменять форму регистрации на форму логина по клику по ссылке модального окна
const signupToLoginAnchor = document.getElementById('mf-signup_to_login');
signupToLoginAnchor.addEventListener('click', e => {
    e.preventDefault();
    replaceAuthForms('login');
});


/**
 * Заменяет формы логина и регистрации на модальном окне
 * @param {string} replaceTo - строка, указывающая на что заменить
 */
const replaceAuthForms = (replaceTo) => {
    const loginBlock = document.getElementById('modal-login-form');
    const signupBlock = document.getElementById('modal-signup-form');

    switch (replaceTo) {
        case 'signup':
            signupBlock.className = "";
            loginBlock.className = "mf-unactive";
            break;

        case 'login':
            signupBlock.className = "mf-unactive";
            loginBlock.className = "";
            break;
    }
}


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