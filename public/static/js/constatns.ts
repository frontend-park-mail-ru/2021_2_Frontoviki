export const validationErrors = {
  passwordMissmatch: 'Неверный пароль',
  noSuchUser: 'Пользователя не существует',
  emailIsUsed: 'Пользователь с такой почтой уже существует',
  nameError: `Имя пользователя должно быть от 3 до 
    10 символов и состоять только из букв`,
  badData: 'Ошибка в email/пароле',
};

export const domainUrl = 'http://www.volchock.ru/';
export const secureDomainUrl = 'https://www.volchock.ru/api/v1';
export const pureIp = 'http://89.19.190.83/';
export const websocketUrl = 'wss://volchock.ru/api/wschat'

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
export const phInputLength = 16;
export const baseCount = 12;

export const profileBtnNum = {
  adBtn: 1,
  favBtn: 3,
  cartBtn: 5,
  chatBtn: 7,
  setBtn: 11,
};

export const regExPatterns = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^[\w\D]{4,}$/,
  name: /^[а-яА-яa-zA-Z]{2,}$/,
};

export const userInfo = new Map();

export const monthMap = new Map();
monthMap.set('1', 'янв');
monthMap.set('2', 'февр');
monthMap.set('3', 'мар');
monthMap.set('4', 'апр');
monthMap.set('5', 'мая');
monthMap.set('6', 'июня');
monthMap.set('7', 'июля');
monthMap.set('8', 'авг');
monthMap.set('9', 'сен');
monthMap.set('10', 'окт');
monthMap.set('11', 'нояб');
monthMap.set('12', 'дек');

export const russian = {
  search : 'Поиск',
  find : 'Найти',
  newAd: 'Разместить объявление',
  signIn: 'Войти',
  categoryBlockText: ' Приходите за покупками на Volchock! ',
  signUp: 'Регистрация',
  hi: 'Привет!',
  signInText: 'Введите ваши данные и совершите свою первую сделку вместе с Volchock',
  welcome: 'Добро пожаловать!',
  signUpText: 'Для совершения сделок, пожалуйста, войдите в сервис',
  password: 'Пароль',
  name: 'Имя',
  surname: 'Фамилия',
  repeatPassword: 'Повторите пароль',
  passwordHint: 'От 5 символов',
  profile: 'Профиль',
  favorite: 'Избранное',
  settings: 'Настройки',
  logout: 'Выйти',
}

export const english = {
  search : 'Search',
  find : 'Find',
  newAd: 'Place new advert',
  signIn: 'Sign In',
  categoryBlockText: ' Come shopping on Volchock! ',
  signUp: 'Sign Up',
  hi: 'Hi!',
  signInText: 'Enter your details and make your first transaction with Volchock',
  welcome: 'Welcome!',
  signUpText: 'To make transactions, please log in to the service',
  password: 'Password',
  name: 'Name',
  surname: 'Surname',
  repeatPassword: 'Repeat password',
  passwordHint: 'From 5 signs',
  profile: 'Profile',
  favorite: 'Favorite',
  settings: 'Settings',
  logout: 'Logout',
}