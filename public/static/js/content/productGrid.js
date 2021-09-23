/**
  * Экспортируемая функция для создания сетки объявлений
  * @param {Array<JSON>} jsonElements массив объявлений в формате json
  * @return {HTMLDivElemnt} div элемент сетки
*/
export function createProductGrid(jsonElements) {
  const productGrid = document.createElement('div');
  productGrid.classList.add('product-grid');

  const productList = document.createElement('section');
  productList.classList.add('cards');

  for (let i = 0; i < jsonElements.length; i++) {
    const {href, src, name, productPrice, location} = jsonElements[i];
    productList.appendChild(
        createProduct(href, src, name, productPrice, location));
  }

  productGrid.appendChild(productList);
  return productGrid;
}

/**
  * Экспортируемая функция для создания одного объявления
  * @param {string} href ссылка на объявление
  * @param {string} src ссылка на аватар объявления
  * @param {string} name название объявления
  * @param {string} productPrice
  * цена продукта пока в виде строки для разных валют???
  * @param {string} location место сделки
  * @return {HTMLDivElemnt} div элемент объявления
  */
function createProduct(href, src, name, productPrice, location) {
  const product = document.createElement('div');
  product.classList.add('card');

  const hyper = document.createElement('a');
  hyper.href = href;


  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');

  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = src;
  const figCap = document.createElement('figcaption');
  const text = document.createElement('h3');
  text.innerHTML = name;
  figCap.appendChild(text);
  figure.appendChild(img);
  figure.appendChild(figCap);

  imageContainer.appendChild(figure);

  const cardInfo = document.createElement('div');
  cardInfo.classList.add('card-info');

  const loc = document.createElement('p');
  loc.innerHTML = location;

  const price = document.createElement('p');
  price.classList.add('card_price');
  price.innerHTML = productPrice;

  cardInfo.appendChild(loc);
  cardInfo.appendChild(price);

  hyper.appendChild(imageContainer);
  hyper.appendChild(cardInfo);
  product.appendChild(hyper);
  return product;
}