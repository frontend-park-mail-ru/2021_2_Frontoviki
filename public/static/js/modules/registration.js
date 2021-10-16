import {Ajax} from './ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {clearInput} from './clearInput.js';
import {createHeader} from '../templates/header/header.js';
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
export function registration(regName, regSurname, regEmail,
    regPass, regPassRep, globalEventBus) {
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
  regPassRep.classList.remove('text-input_wrong');
  regPassRep.classList.add('text-input_correct');

  const allowedNameLen = 2;
  if (name.length < allowedNameLen) {
    regName.classList.add('text-input_wrong');
    return;
  }
  regName.classList.remove('text-input_wrong');
  regName.classList.add('text-input_correct');

  if (surname.length < allowedNameLen) {
    regSurname.classList.add('text-input_wrong');
    return;
  }
  regSurname.classList.remove('text-input_wrong');
  regSurname.classList.add('text-input_correct');

  const response = Ajax.asyncPostUsingFetch({
    url: secureDomainUrl + 'signup',
    body: {email, password, name, surname},
  });

  response.then(({status, parsedBody}) => {
    if (status != statusCodes.OK) {
      return;
    }
    const {code} = parsedBody;
    if (code === statusCodes.REGDONE) {
      createHeader(globalEventBus);
      clearAllRegInputs(regName, regSurname, regEmail, regPass, regPassRep);
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

/**
 * очищает все input'ы регистрации в модальном окне
 * @param {HTMLDivElement} regName
 * @param {HTMLDivElement} regSurname
 * @param {HTMLDivElement} regEmail
 * @param {HTMLDivElement} regPass
 * @param {HTMLDivElement} regPassRep
 */
function clearAllRegInputs(regName, regSurname, regEmail, regPass, regPassRep) {
  clearInput(regName);
  clearInput(regEmail);
  clearInput(regSurname);
  clearInput(regPass);
  clearInput(regPassRep);
}
