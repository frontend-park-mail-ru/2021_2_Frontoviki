import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {createHeader} from '../content/templates/header/header.js';
const inputNum = 3;
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regSurname фамилия пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
 * действие submit
 */
export function registration(regName, regSurname, regEmail, regPass, regPassRep) {
  const name = regName.childNodes[inputNum].value.trim();
  const surname = regSurname.childNodes[inputNum].value.trim();
  const email = regEmail.childNodes[inputNum].value.trim();
  const password = regPass.childNodes[inputNum].value.trim();
  const passwordRep = regPassRep.childNodes[inputNum].value.trim();

  const valid = validate(regEmail.childNodes[inputNum], patterns['email']) &&
    validate(regPass.childNodes[inputNum], patterns['password']);

  if (!valid) {
    regEmail.childNodes[5].innerHtml = 'Введите валидный email';
    return;
  }
  if (password !== passwordRep) {
    regPassRep.classList.add('text-input_wrong');
    return;
  }
  const allowedNameLen = 2;
  if (name.length < allowedNameLen) {
    regName.classList.add('text-input_wrong');
    return;
  }
  if (surname.length < allowedNameLen) {
    regSurname.classList.add('text-input_wrong');
    return;
  }
  const response = Ajax.asyncPostUsingFetch({
    url: secureDomainUrl + 'signup',
    body: {email, password, name, surname},
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
    regEmail.childNodes[5].innerHTML = 'Такой пользователь уже существует';
    regEmail.classList.remove('text-input_correct');
    regEmail.classList.add('text-input_wrong');
  });
}

const patterns = {
  email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
  password: /^[\w]{4,}$/,
};

const validate = (field, regex) => {
  const valid = regex.test(field.value);
  if (valid) {
    field.parentNode.classList.add('text-input_correct');
  } else {
    field.parentNode.classList.add('text-input_wrong');
  }
  return valid;
};
