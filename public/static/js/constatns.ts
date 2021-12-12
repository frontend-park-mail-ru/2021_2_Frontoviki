import { categoryList } from "./types";

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
  paidBtn: 9,
  setBtn: 11,
};

export const regExPatterns = {
  email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  password: /^[\w\D]{4,}$/,
  name: /^[а-яА-яa-zA-Z]{2,}$/,
};

export const basePromotionPrice = 2;
export const promotionCoefficient = 3;

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

export const monthMapEng = new Map();
monthMapEng.set('1', 'Jan');
monthMapEng.set('2', 'Feb');
monthMapEng.set('3', 'Mar');
monthMapEng.set('4', 'Apr');
monthMapEng.set('5', 'May');
monthMapEng.set('6', 'June');
monthMapEng.set('7', 'July');
monthMapEng.set('8', 'Aug');
monthMapEng.set('9', 'Sept');
monthMapEng.set('10', 'Oct');
monthMapEng.set('11', 'Nov');
monthMapEng.set('12', 'Dec');

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
  notFound: 'Страница не найдена',
  resourceNotExist: 'Похоже, ресурс, к которому вы хотите обратиться, не существует',
  returnToMain: 'Вернуться на главную',
  easterEggText: 'Похоже, что вы не подключены к сети, проверьте свое соединение или оплатите интернет',
  easterEggEasy: 'Легко',
  easterEggMedium: 'Нормально',
  easterEggHard: 'Сложно',
  easterEggAgain: 'Заново',
  back: 'Назад',
  adsInCategory: 'Объявления в категории',
  searchHelp: 'Объявления по запросу',
  categoryWelcome: 'Приходите за покупками на Volchock!',
  createAccount: 'Создать аккаунт',
  emailHint: 'Введите валидный email',
  nameNoSignsHint: 'Должно быть без спецсимволов',
  surnameNoSignsHint: 'Должна быть без спецсимволов',
  nameHint: 'Должно быть от 2-х символов',
  surnameHint: 'Должна быть от 2-х символов',
  repeatPasswordHint: 'Пароли должны совпадать',
  emailLogInHint: 'Такого пользователя не существует',
  passwordLogInHint: 'Неверный пароль',
  passwordFullHint: 'Должен быть от 5-ти символов',
  buy: 'Купить',
  myAdverts: 'Мои объявления',
  cart: 'Корзина',
  messages: 'Сообщения',
  paid: 'Платные услуги',
  onSiteFrom: 'На сайте с',
  yourRate: 'Вы оценили пользователя на',
  advertsTitle: 'Объявления',
  zeroPrice: 'По запросу',
  noAdsInCategory: 'Объявлений в данной категории нет',
  noAdsInSearch: 'Ничего не найдено',
  userExist: 'Такой пользователь уже существует',
  hideMap: 'Скрыть карту',
  showMap: 'Раскрыть карту',
  inCart: 'В корзине',
  yourAdvert: 'Ваше объявление',
  inFav: 'В избранном',
  main: 'Главная',
  addToFav: 'Добавить в избранное',
  priceLabel: 'Цена:',
  chatBtn: 'Написать продавцу',
  addToCart: 'Добавить в корзину',
  edit: 'Редактировать',
  conditionNew: 'Состояние: Новое',
  conditionUsed: 'Состояние: Б/У',
  descriptionLabel: 'Описание:',
  publishDateLabel: 'Дата публикации:',
  viewsLabel: 'Просмотры:',
  salesmanLabel: 'Продавец:',
  yourAdverts: ' Ваши объявления ',
  active: 'Активные',
  archive: 'Архив',
  emptyFav: 'В избранном ничего нет',
  emptyArchive: 'Архивные объявления будут отображаться на этой странице',
  emptyActive: 'Активных объявлений нет',
  chat: 'Сообщения',
  emptyCart: 'Корзина пуста',
  passwordChanged: 'Пароль изменен',
  infoSaved: 'Информация сохранена',
  passwordEqual: 'Пароли одинаковые',
  passwordToWeak: 'Пароль слишком простой',
  modalDeleteText: 'По какой причине вы хотите удалить объявление?',
  sell: 'Продал на Волчке',
  otherReason: 'Другая причина',
  modalDeleteHint: ' Если вы продали объявление, то мы сохраним его в архив ',
  buing: 'Покупка',
  good: 'Товар:',
  salesmanEmail: 'email продавца:',
  phone: 'Контактный телефон:',
  price: 'Цена:',
  avatarUpload: 'Загрузка аватара',
  changePassword: 'Изменение пароля',
  oldPassword: 'Старый пароль',
  incorrectPassword: 'Неверный пароль',
  newPassword: 'Новый пароль',
  newPasswordHint: 'Пароль слишком простой',
  changePasswordBtn: 'Изменить пароль',
  personalInfo: 'Личные данные',
  nameSettingsHint: 'Имя не удовлетворяет требованиям',
  surnameSettingsHint: 'Фамилия не удовлетворяет требованиям',
  fullEmail: 'Электронная почта',
  mobilePhone: 'Мобильный телефон',
  mobilePhoneHint: 'Ошибка в телефоне',
  changeInfo: 'Изменить информацию',
  newAdvert: 'Новое объявление',
  title: 'Название',
  titleHint: 'Ошибка в названии',
  category: 'Категория',
  description: 'Описание объявления',
  condition: 'Состояние',
  conditionAdNew: 'Новое',
  conditionAdUsed: 'Б/У',
  priceHint: 'Ошибка в цене',
  uploadImages: 'Загрузите фотографии',
  add: 'Добавить',
  address: 'Адрес',
  addressHint: 'Неверное местоположение',
  submit: 'Опубликовать',
  cancel: 'Отменить',
  mapHint: 'Используйте карту для выбора адреса',
  win: 'Вы выиграли!',
  lose: 'КАБУМ! Вы проиграли.',
  priceDiv: 'История изменения цены',
  promotion: 'Продвижение объявлений',
  promotionHint: 'Выберите объявление, которое хотите продвигать',

}

export const english = {
  search : 'Search',
  find : 'Find',
  newAd: 'New advert',
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
  notFound: 'Page not found',
  resourceNotExist: `It looks like the resource you want to access doesn't exist`,
  returnToMain: 'Back to main page',
  easterEggText: 'It looks like you are not connected to the network, check your connection or pay for the internet',
  easterEggEasy: 'Easy',
  easterEggMedium: 'Normal',
  easterEggHard: 'Hard',
  easterEggAgain: 'Again',
  back: 'Go back',
  adsInCategory: 'Ads in the category',
  searchHelp: 'Ads on request',
  categoryWelcome: 'Come shopping on Volchock!',
  createAccount: 'Create new account',
  emailHint: 'Enter valid email',
  nameNoSignsHint: 'Cannot contain special symbols',
  surnameNoSignsHint: 'Cannot contain special symbols',
  nameHint: 'From 2 signs',
  surnameHint: 'From 2 signs',
  repeatPasswordHint: 'Password must be equal',
  emailLogInHint: 'No user found',
  passwordLogInHint: 'incorrect password',
  passwordFullHint: 'From 5 signs',
  buy: 'Buy',
  myAdverts: 'My adverts',
  cart: 'Cart',
  messages: 'Messages',
  paid: 'Paid options',
  onSiteFrom: 'On website from',
  yourRate: 'You rate this user for',
  advertsTitle: 'Adverts',
  zeroPrice: 'On request',
  noAdsInCategory: 'No adverts in this category',
  noAdsInSearch: 'Nothing found',
  userExist: 'User already exists',
  hideMap: 'Hide map',
  showMap: 'Show map',
  inCart: 'In cart',
  yourAdvert: 'Your advert',
  inFav: 'In favorite',
  main: 'Main page',
  addToFav: 'Add to favorite',
  priceLabel: 'Price:',
  chatBtn: 'Contact salesman',
  addToCart: 'Add to cart',
  edit: 'Edit',
  conditionNew: 'Condition: New',
  conditionUsed: 'Condition: Used',
  descriptionLabel: 'Description:',
  publishDateLabel: 'Publish Date:',
  viewsLabel: 'Views:',
  salesmanLabel: 'Salesman:',
  yourAdverts: ' Your adverts ',
  active: 'Active',
  archive: 'Archived',
  emptyFav: 'Favorite is empty',
  emptyArchive: 'Archived adverts will be displayed on this page',
  emptyActive: 'No active adverts',
  chat: 'Messages',
  emptyCart: 'Cart is empty',
  passwordChanged: 'Pasword changed',
  infoSaved: 'Info saved',
  passwordEqual: 'Passwords are equal',
  passwordToWeak: 'Password is too weak ',
  modalDeleteText: 'For what reason do you want to delete the advert?',
  sell: 'Sell on Volchock',
  otherReason: 'Other reason',
  modalDeleteHint: ' If you have sold an ad, we will save it to the archive ',
  buing: 'Purchase',
  good: 'Product:',
  salesmanEmail: 'Salesman email:',
  phone: 'Salesman phone:',
  price: 'Price:',
  avatarUpload: 'Upload avatar',
  changePassword: 'Password changing',
  oldPassword: 'Old password',
  incorrectPassword: 'Password is incorrect',
  newPassword: 'New password',
  newPasswordHint: 'Password is too weak',
  changePasswordBtn: 'Change password',
  personalInfo: 'Personal Info',
  nameSettingsHint: 'Name does not meet the requirements',
  surnameSettingsHint: 'Surname does not meet the requirements',
  fullEmail: 'Email',
  mobilePhone: 'Mobile phone',
  mobilePhoneHint: 'Error in phone format',
  changeInfo: 'Save info',
  newAdvert: 'New Advert',
  title: 'Title',
  titleHint: 'Error in title',
  category: 'Category',
  description: `Advert's description`,
  condition: 'Condition',
  conditionAdNew: 'New',
  conditionAdUsed: 'Used',
  priceHint: 'Error in price',
  uploadImages: 'Upload images',
  add: 'Add',
  address: 'Address',
  addressHint: 'Error in address',
  submit: 'Publish',
  cancel: 'Cancel',
  mapHint: 'Use map to choose address',
  win: 'You won!',
  lose: 'BOOM! You lose.',
  priceDiv: 'Price change history',
  promotion: 'Advert promotion',
  promotionHint: 'Choose an advert to promote',
}

export const engCategories:categoryList[] = [
  {name: 'Clothes', href:'', analog:'Одежда'},
  {name: 'Footwear', href:'', analog:'Обувь'},
  {name: 'Animals', href:'', analog:'Животные'},
  {name: 'Smartphones', href:'', analog:'Смартфоны'},
  {name: 'Notebooks', href:'', analog:'Ноутбуки'},
  {name: 'Appliances', href:'', analog:'Бытовая техника'},
  {name: 'Literature', href:'', analog:'Книги'},
  {name: 'Furniture', href:'', analog:'Мебель'},
  {name: 'For sport', href:'', analog:'Спортивный инвентарь'},
  {name: 'Jewelry', href:'', analog:'Ювелирные украшения'},
  {name: 'Household Goods', href:'', analog:'Товары для дома'},
  {name: 'Transport', href:'', analog:'Транспорт'},
  {name: 'Other', href:'', analog:'Другое'}
]
