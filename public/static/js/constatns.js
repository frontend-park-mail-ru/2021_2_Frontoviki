export const navigation = {
  category: 'Искуcство',
  subCategory: 'Картины',
  categoryHref: '',
  subCategoryHref: '',
};

export const categories = [
  {
    title: 'Кек',
    href: '',
  },
  {
    title: 'кошка',
    href: '',
  },
  {
    title: 'Найс',
    href: '',
  },
];

Handlebars.registerHelper('times', function(n, block) {
  let accum = '';
  for (let i = 0; i < n; ++i) {
    accum += block.fn(i);
  }
  return accum;
});

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
  UNTHORISED: 401,
  FORBIDEN: 403,
  NOTEXIST: 404,
  INTERNALERROR: 500,
};
