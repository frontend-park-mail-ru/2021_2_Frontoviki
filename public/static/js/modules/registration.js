import {Ajax} from './ajax.js';
import {secureDomainUrl} from '../constatns.js';
import {createHeader} from '../content/header.js';
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regForm форма регистрации, для которой изменится
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
 * действие submit
 */
export function registration(regForm, regName, regEmail, regPass, regPassRep) {
  const promtEmailAlrdyExist = document.querySelector('#emailExst');
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const valid = validate(regName, patterns[regName.attributes.name.value]) &&
        validate(regEmail, patterns[regEmail.attributes.name.value]) &&
        validate(regPass, patterns[regPass.attributes.name.value]);

    const name = regName.value.trim();
    const email = regEmail.value.trim();
    const password = regPass.value.trim();
    const passwordRep = regPassRep.value.trim();

    if (password !== passwordRep) {
      regPassRep.className = 'invalid';
    }

    if (!valid || password !== passwordRep) {
      return;
    }

    // значения по умолчанию при регистрации
    const rating = 0;
    const profilePic = 'static/img/default_image.jpg';

    const response = Ajax.asyncPostUsingFetch({
      url: secureDomainUrl + 'signup',
      body: {email, password, name, rating, profilePic},
    });

    response.then(({status, parsedBody}) => {
      if (status != 200) {
        return;
      }
      const {code} = parsedBody;
      if (code === 201) {
        createHeader();
        document.querySelector('.blackout').click();
        return;
      }
      regEmail.className = 'invalid';
      promtEmailAlrdyExist.classList.add('show');
    });
  });
}

const patterns = {
  username: /^[a-zА-Яа-я()\d]{5,20}$/i,
  email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
  /* /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])
  [0-9a-zA-Z!@#$%^&*]{8,}$/i, */
  password: /^[a-zA-z0-9!@#$%^&*.,$№%\d]{8,}$/i,
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
