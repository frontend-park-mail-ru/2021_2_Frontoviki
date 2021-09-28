export const AJAX_STATUSES = {
  OK: 200,
};

const ad = {
  href: '',
  src: './static/img/2spooky4me.jpg',
  name: 'Картина',
  productPrice: '100$',
  location: 'Москва',
};

const ad1 = {
  href: '',
  src: './static/img/shpicz.jpg',
  name: 'Кек',
  productPrice: '100500$',
  location: 'Ракетный завод',
};

export const adsArray = [
  ad1,
  ad1,
  ad,
  ad,
  ad1,
  ad,
];

export const navigation = {
  category: 'Исккуство',
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
  nameError: `Имя пользователя должно быть от 5 до 
    20 символов и состоять только из букв`,
};

