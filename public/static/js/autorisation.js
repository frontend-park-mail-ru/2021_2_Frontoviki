const root = document.getElementById('root');

const configApp = {
    menu: {
        href: '/menu',
        name: 'Меню',
        open: menuPage,
    },
    signup: {
        href: '/signup',
        name: 'Регистрация',
        open: signupPage,
    },
    login: {
        href: '/login',
        name: 'Авторизация',
        open: loginPage,
    },
    profile: {
        href: '/profile',
        name: 'Профиль',
        open: profilePage,
    },
    about: {
        href: '/about',
        name: 'Контакты',
    },
}

function profilePage() {
    root.innerHTML = '';

    ajax(
        'GET',
        '/me',
        null,
        (status, responseText) => {
            let isAuthorized = false;

            if (status === 200) {
                isAuthorized = true;
            }

            if (isAuthorized) {
                const {age, score, images} = JSON.parse(responseText);

                const span = document.createElement('span');
                span.textContent = `Мне ${age} и я крутой на ${score} очков`;

                root.appendChild(span);

                const back = document.createElement('a');
                back.href = '/menu';
                back.textContent = 'Назад';
                back.dataset.section = 'menu';

                root.appendChild(back);

                if (images && Array.isArray(images)) {
                    const div = document.createElement('div');
                    root.appendChild(div);

                    images.forEach((imageSrc) => {
                        div.innerHTML += `<img src="${imageSrc}"/>`;
                    })
                }

                return;
            }
            alert('АХТУНГ НЕТ АВТОРИЗАЦИИ');
            console.log(responseText);
            loginPage();
        }
    );
}

root.addEventListener('click', e => {
    const {target} = e;
    if (target instanceof HTMLAnchorElement) {
        e.preventDefault();
        configApp[target.dataset.section].open();
    }
})