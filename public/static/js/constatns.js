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
  INTERNALERROR: 500,
};

export const categories = ['Обувь', 'Одежда', 'Животные',
  'Смартфоны', 'Бытовая Техника', 'Ноутбуки'];
