export const validationErrors = {
  passwordMissmatch: 'Неверный пароль',
  noSuchUser: 'Пользователя не существует',
  emailIsUsed: 'Пользователь с такой почтой уже существует',
  nameError: `Имя пользователя должно быть от 3 до 
    10 символов и состоять только из букв`,
  badData: 'Ошибка в email/пароле',
};

export const domainUrl = 'http://www.volchock.ru/';
export const secureDomainUrl = 'https://www.volchock.ru/v1/api';
export const pureIp = 'http://89.19.190.83/';

export const statusCodes = {
  OK: 200,
  REGDONE: 201,
  BADREQUEST: 400,
  UNATHORISED: 401,
  FORBIDEN: 403,
  NOTEXIST: 404,
  DELETED: 409,
  INTERNALERROR: 500,
};

export const idNum = 2;
export const minValidationLen = 2;
export const inputNum = 3;
export const oldPassNum = 5;
export const passwordLength = 5;
export const phLength = 11;
export const baseCount = 12;

export const profileBtnNum = {
  adBtn: 1,
  favBtn: 3,
  cartBtn: 5,
  setBtn: 11,
};

export const regExPatterns = {
  email: /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/,
  password: /^[\w\D]{4,}$/,
  name: /^[а-яА-яa-zA-Z]{2,}$/,
};
