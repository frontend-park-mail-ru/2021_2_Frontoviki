const inputNum = 3;
/**
 * функция регистрация нового пользователя
 * @param {HTMLFormElement} regName имя пользователя
 * @param {HTMLFormElement} regSurname фамилия пользователя
 * @param {HTMLFormElement} regEmail почта пользователя для регистрации
 * @param {HTMLFormElement} regPass пароль пользователя
 * @param {HTMLFormElement} regPassRep форма повторного ввода пароля
 * @return {*} значения инпутов
 */
export function validateInfo(regName, regSurname, regEmail,
    regPass, regPassRep) {
  const name = regName.childNodes[inputNum].value.trim();
  const surname = regSurname.childNodes[inputNum].value.trim();
  const email = regEmail.childNodes[inputNum].value.trim();
  const password = regPass.childNodes[inputNum].value.trim();
  let passwordRep;
  if (regPassRep !== null) {
    passwordRep = regPassRep.childNodes[inputNum].value.trim();
  }

  const valid = validate(regEmail.childNodes[inputNum], patterns['email']) &&
    validate(regPass.childNodes[inputNum], patterns['password']);

  if (!valid) {
    regEmail.childNodes[5].innerHtml = 'Введите валидный email';
    return;
  }
  if (passwordRep !== null) {
    if (password !== passwordRep) {
      regPassRep.classList.add('text-input_wrong');
      return;
    }
    regPassRep.classList.remove('text-input_wrong');
    regPassRep.classList.add('text-input_correct');
  }
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
  return {name, surname, email, password};
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
