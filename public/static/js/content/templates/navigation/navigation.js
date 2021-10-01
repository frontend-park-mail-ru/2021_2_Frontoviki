/**
 * @param {Array<string>} categories массив категорий
 * @return {HTMLDivElemt} меню с поисковой строкой
 *  и выпадающее меню с категориями
 */
export function createNavigation(categories) {
  const navigation = document.createElement('div');
  navigation.classList.add('navigation');
  const navigationTemplate = Handlebars.templates.navigation;
  navigation.innerHTML = navigationTemplate({navigation: categories});
  return navigation;
};
