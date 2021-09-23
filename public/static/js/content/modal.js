import {createHeader} from './header.js';

/**
  * Экспортируемая функция для генерации модального окна
  * с регистрацией и авторизацией
*/
export function createModal() {
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
  logForm.classList.add('modal-form');

  /* Инпут емайла с блоком подсказок */
  const logemail = document.createElement('input');
  logemail.type = 'email';
  logemail.name = 'email';
  logemail.placeholder = 'Email';
  logemail.addEventListener('keyup', (e) => {
    e.target.classList = '';
  });
  logForm.appendChild(logemail);

  const promtEmailBlockLogin = document.createElement('div');
  promtEmailBlockLogin.name = 'signup-username';
  promtEmailBlockLogin.classList.add('promt-block');

  const promtEmailInvalidLogin = document.createElement('p');
  promtEmailInvalidLogin.classList.add('promt');
  promtEmailInvalidLogin.innerHTML = 'Неверный емайл';
  promtEmailBlockLogin.appendChild(promtEmailInvalidLogin);
  logForm.appendChild(promtEmailBlockLogin);

  /* Инпут пароля с блоком подсказок */
  const logpassword = document.createElement('input');
  logpassword.type = 'password';
  logpassword.name = 'password';
  logpassword.placeholder = 'Пароль';
  logpassword.addEventListener('keyup', (e) => {
    e.target.classList = '';
  });
  logForm.appendChild(logpassword);

  const promtPasswordBlockLogin = document.createElement('div');
  promtPasswordBlockLogin.name = 'signup-username';
  promtPasswordBlockLogin.classList.add('promt-block');

  const promtPasswordInvalidLogin = document.createElement('p');
  promtPasswordInvalidLogin.classList.add('promt');
  promtPasswordInvalidLogin.innerHTML = 'Неверный пароль';
  promtPasswordBlockLogin.appendChild(promtPasswordInvalidLogin);
  logForm.appendChild(promtPasswordBlockLogin);
  /* конец блока подсказок логина */

  const btn = document.createElement('input');
  btn.type = 'submit';

  const patterns = {
    username: /^[a-z\d]{5,20}$/i,
    email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
    /* /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])
    [0-9a-zA-Z!@#$%^&*]{8,}$/i, */
    password: /^[a-z\d]{5,20}$/i,
    telephone: /^\d{11}$/,
    slug: /^[a-z\d-]{8,20}$/i,
  };

  const validate = (field, regex) => {
    const valid = regex.test(field.value);
    if (valid) {
      field.className = 'valid';
    } else {
      field.className = 'invalid';
    }
    return valid;
  };

  logForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = logemail.value.trim();
    const password = logpassword.value.trim();
    Ajax.ajaxPost({
      url: '/login',
      body: {email, password},
      callback: (status, res) => {
        if (status === 200) {
          // в случае если мы зашли убрать модальное и обновить хедер
          createHeader();
          black.click();
          return;
        }

        const {error} = JSON.parse(res);
        logpassword.className = 'invalid';
        promtPasswordInvalidLogin.innerHTML = error;
      },
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
  regForm.classList.add('modal-form');

  /* Инпут имени пользователя с блоком подсказок */
  const nameR = document.createElement('input');
  nameR.type = 'text';
  nameR.name = 'username';
  nameR.placeholder = 'Имя';
  nameR.addEventListener('keyup', (e) => {
    e.target.classList = '';
    // очищаю класс show у server-invalid
    const promt = e.target.nextSibling.firstChild; // input->div->p
    promt.classList.remove('show');
  });
  regForm.appendChild(nameR);

  const promtUsernameBlock = document.createElement('div');
  promtUsernameBlock.name = 'signup-username';
  promtUsernameBlock.classList.add('promt-block');

  const promtUsernameAlrdyExist = document.createElement('p');
  promtUsernameAlrdyExist.classList.add('promt', 'server-invalid');
  promtUsernameAlrdyExist.innerHTML =
    'Пользователь с таким именем уже существует';
  promtUsernameBlock.appendChild(promtUsernameAlrdyExist);

  const promtUsernameInvalidName = document.createElement('p');
  promtUsernameInvalidName.classList.add('promt');
  promtUsernameInvalidName.innerHTML =
    'Имя пользователя должно быть от 5 до 20 символов';
  promtUsernameBlock.appendChild(promtUsernameInvalidName);
  regForm.appendChild(promtUsernameBlock);

  /* Инпут имейла с блоком подсказок */
  const emailR = document.createElement('input');
  emailR.type = 'email';
  emailR.name = 'email';
  emailR.placeholder = 'Email';
  emailR.addEventListener('keyup', (e) => {
    e.target.classList = '';
    // очищаю класс show у server-invalid
    const promt = e.target.nextSibling.firstChild; // input->div->p
    promt.classList.remove('show');
  });
  regForm.appendChild(emailR);

  const promtEmailBlock = document.createElement('div');
  promtEmailBlock.classList.add('promt-block');
  promtEmailBlock.name = 'signup-email';

  const promtEmailAlrdyExist = document.createElement('p');
  promtEmailAlrdyExist.classList.add('promt', 'server-invalid');
  promtEmailAlrdyExist.innerHTML = 'Этот емайл уже используется';
  promtEmailBlock.appendChild(promtEmailAlrdyExist);

  const promtEmailInvalidName = document.createElement('p');
  promtEmailInvalidName.classList.add('promt');
  promtEmailInvalidName.innerHTML =
    'Неверный формат емайла (пример: exam@ple.com)';
  promtEmailBlock.appendChild(promtEmailInvalidName);
  regForm.appendChild(promtEmailBlock);

  /* Инпут пароля с блоком подсказок */
  const pswrdR = document.createElement('input');
  pswrdR.type = 'password';
  pswrdR.name = 'password';
  pswrdR.placeholder = 'Пароль';
  pswrdR.addEventListener('keyup', (e) => {
    e.target.classList = '';
    // очищаю класс show у server-invalid
    const promt = e.target.nextSibling.firstChild; // input->div->p
    promt.classList.remove('show');
  });
  regForm.appendChild(pswrdR);

  const promtPasswordBlock = document.createElement('div');
  promtPasswordBlock.classList.add('promt-block');
  promtPasswordBlock.name = 'signup-password';

  const promtPasswordInvalid = document.createElement('p');
  promtPasswordInvalid.classList.add('promt');
  promtPasswordInvalid.innerHTML = `Пароль должен состоять из букв,
    цифр и спец символов, длинной от 8 символов`;
  promtPasswordBlock.appendChild(promtPasswordInvalid);
  regForm.appendChild(promtPasswordBlock);

  /* Инпут повтора пароля с блоком подсказок */
  const passwordRepR = document.createElement('input');
  passwordRepR.type = 'password';
  passwordRepR.name = 'password';
  passwordRepR.placeholder = 'Повторите Пароль';
  regForm.appendChild(passwordRepR);

  const promtRepPasswordBlock = document.createElement('div');
  promtRepPasswordBlock.classList.add('promt-block');
  promtRepPasswordBlock.name = 'signup-password';

  const promtRepPasswordInvalid = document.createElement('p');
  promtRepPasswordInvalid.classList.add('promt');
  promtRepPasswordInvalid.innerHTML = 'Пароли должны совпадать';
  promtRepPasswordBlock.appendChild(promtRepPasswordInvalid);
  regForm.appendChild(promtRepPasswordBlock);
  /* конец блока подсказок */

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

    const valid = validate(nameR, patterns[nameR.attributes.name.value]) &&
                    validate(emailR, patterns[emailR.attributes.name.value]) &&
                    validate(pswrdR, patterns[pswrdR.attributes.name.value]);

    const name = nameR.value.trim();
    const email = emailR.value.trim();
    const password = pswrdR.value.trim();
    const passwordRep = passwordRepR.value.trim();

    if (password !== passwordRep) {
      passwordRepR.className = 'invalid';
    }

    if (!valid || password !== passwordRep) {
      return;
    }

    // значения по умолчанию при регистрации
    const rating = 0;
    const profilePic = 'static/img/default_image.jpg';

    Ajax.ajaxPost({
      url: '/signup',
      body: {email, password, name, rating, profilePic},
      callback: (status, res) => {
        if (status === 201) {
          // если зарегались, показываем окно логина
          ent.click();
          return;
        }

        const {error} = JSON.parse(res);
        console.log(error);
        if (error != null) {
          emailR.className = 'invalid';
          promtEmailAlrdyExist.classList.add('show');
        }
      },
    });
  });

  regView.appendChild(regForm);

  modal.appendChild(regView);
  modal.appendChild(loginView);

  wrapper.appendChild(modal);
  wrapper.appendChild(black);
}