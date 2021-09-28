/**
  * Экспортируемая функция для создания сетки объявлений
  * @param {Array<JSON>} jsonElements массив объявлений в формате json
  * @return {HTMLDivElemnt} div элемент сетки
*/
export function createProductGrid(jsonElements) {
  const gridTemplate = Handlebars.templates.productGrid;
  const productGrid = document.createElement('div');
  productGrid.classList.add('product-grid');
  console.log(jsonElements[0]);
  productGrid.innerHTML = gridTemplate({adsArray: jsonElements});
  return productGrid;
};
