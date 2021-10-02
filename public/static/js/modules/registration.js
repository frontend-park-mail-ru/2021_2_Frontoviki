import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
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
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = regName.value.trim().split(' ');
    const name = data[0];
    const surname = data[1];
    const email = regEmail.value.trim();
    const password = regPass.value.trim();
    const passwordRep = regPassRep.value.trim();

    const valid = validate(regEmail, patterns['email']) &&
    validate(regPass, patterns['password']);

    if (password !== passwordRep) {
      regPassRep.className = 'invalid';
      return;
    }
    const allowedNameLen = 2;
    if (name.length < allowedNameLen || surname.length < allowedNameLen) {
      regName.className = 'invalid';
      return;
    }

    if (!valid || password !== passwordRep) {
      return;
    }

    // значения по умолчанию при регистрации
    const rating = 0;
    const profilePic = 'static/img/default_image.jpg';

    const response = Ajax.asyncPostUsingFetch({
      url: secureDomainUrl + 'signup',
      body: {email, password, name, surname, rating, profilePic},
    });

    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.REGDONE) {
        createHeader();
        document.querySelector('.blackout').click();
        return;
      }
      regEmail.className = 'invalid';
      document.querySelector('#emailExst').classList.add('show');
    });
  });
}

const patterns = {
  email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
  password: /^[\w]{4,}$/,
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
