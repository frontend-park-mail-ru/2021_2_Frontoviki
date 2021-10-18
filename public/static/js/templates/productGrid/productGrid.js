/**
  * Экспортируемая функция для создания сетки объявлений
  * @param {Array<JSON>} jsonElements массив объявлений в формате json
  * @return {HTMLDivElemnt} div элемент сетки
*/
export function createProductGrid(jsonElements, canDelete, canBuy) {
  const gridTemplate = Handlebars.templates.productGrid;
  const productGrid = document.createElement('div');
  productGrid.classList.add('root__product-grid');
  console.log(canBuy, canDelete);
  jsonElements.forEach((element) => {
    element.canDelete = canDelete;
    element.canBuy = canBuy;
  });
  productGrid.innerHTML = gridTemplate({adsArray: jsonElements});
  return productGrid;
};
