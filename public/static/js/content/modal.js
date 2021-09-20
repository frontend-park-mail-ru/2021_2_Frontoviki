// создает модальное
export function CreateModal() {
    const wrapper = document.querySelector('.wrapper');
    const black = document.createElement('div');
    black.classList.add('blackout');

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

    const logemail = document.createElement('input');
    logemail.type = 'email';
    logemail.name = 'email';
    logemail.placeholder = 'Email';
    logForm.appendChild(logemail);

    const logpassword = document.createElement('input');
    logpassword.type = 'password';
    logpassword.name = 'password';
    logpassword.placeholder = 'Пароль';
    logForm.appendChild(logpassword);

    const btn = document.createElement('input');
    btn.type = 'submit';

    logForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = logemail.value.trim();
        const password = logpassword.value.trim();
        Ajax.ajaxPost({
            url : '/login',
            body : {email, password},
            callback: (status) => {
                if (status === 200) {
                    createHeader();
                    black.click();
                    return;
                }
                alert('НЕ получилось не фартануло');
              }
        });
    });

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

    const nameR = document.createElement('input');
    nameR.type = 'name';
    nameR.placeholder = 'Имя';
    regForm.appendChild(nameR);

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

    regForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = nameR.value.trim();
        const email = emailR.value.trim();
        const password = passwordR.value.trim();;
        Ajax.ajaxPost({
            url : '/signup',
            body : {email, password, name},
            callback: (status) => {
                if (status === 201) {
                    ent.click();
                    return;
                }
                alert('НЕ получилось не фартануло');
              }
        });
    });

    regView.appendChild(regForm);

    modal.appendChild(regView);
    modal.appendChild(loginView);

    wrapper.appendChild(modal);
    wrapper.appendChild(black);
}