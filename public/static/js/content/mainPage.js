import {createProductGrid} from './productGrid.js';

/**
  * Экспортируемый класс для генерации страницы с сеткой
  * товаров, поиском и меню категорий
*/
export class MainPage {
    #parent

    /**
     * Конструктор класса
     * @param {HTMLElement} parent - родительский элемент страницы,
     *  в который записывается весь контент, чаще всего root
    */
    constructor(parent) {
      this.#parent = parent;
    }

    /**
     * Функция рендера генерерует весь контент страницы
     * @param {string} category основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {string} subCategory более специализированная категория
     * сортировки страницы. Например 'смартфоны'.
     * @param {Array<string>} searchCategories массив для выпадающего
     * меню поиска
    */
    render(category, subCategory, searchCategories, ...jsonElements) {
      this.#parent.innerHTML = '';
      this.#parent.appendChild(this.#createNavigation(...searchCategories));

      const productClass = document.createElement('div');
      productClass.classList.add('product-path');
      productClass.appendChild(this.#productPath(category, subCategory));
      this.#parent.appendChild(productClass);
      this.#parent.appendChild(createProductGrid(jsonElements));
    }
    /**
     * Функция создания меню 'пути продукта' вида category / subcategory
     * @param {string} category основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {string} subCategory более специализированная категория
     * сортировки страницы. Например 'смартфоны'.
     * @return {HTMLULlistElement}
    */
    #productPath(category, subCategory) {
      const list = document.createElement('ul');

      const cat = document.createElement('li');
      const ref = document.createElement('a');
      ref.href = '/';
      ref.innerHTML = category;
      cat.appendChild(ref);
      list.appendChild(cat);

      const subcat = document.createElement('li');
      const subref = document.createElement('a');
      subref.href = '/';
      subref.innerHTML = subCategory;
      subcat.appendChild(subref);
      list.appendChild(subcat);

      return list;
    }

    // Добавляет любое количество пунктов в выпадющее меню категорий и поиск
    /**
     * Функция создания выпадающего меню рядом с поиском
     * @param {string} categories rest оператор для передачи неограниченного
     * числа названий категорий
     * @return {HTMLDivElement} возвращает html элемент
    */
    #createNavigation(...categories) {
      const navigation = document.createElement('div');
      navigation.classList.add('navigation');

      const nav = document.createElement('nav');
      nav.classList.add('categories');
      const menu = document.createElement('p');
      menu.innerHTML = 'III';
      nav.appendChild(menu);

      const input = document.createElement('input');
      input.id = 'categories_toogle';
      input.type = 'checkbox';
      input.checked = true;
      nav.appendChild(input);

      // выпадающее меню с категориями
      const catList = document.createElement('ul');
      categories.forEach((elem) => {
        const cat = document.createElement('li');
        const ref = document.createElement('a');
        ref.href = '#';
        ref.innerHTML = elem;
        cat.appendChild(ref);
        catList.appendChild(cat);
      });
      nav.appendChild(catList);


      const srch = document.createElement('div');
      srch.classList.add('search');

      const srchInput = document.createElement('input');
      srchInput.type = 'text';
      srchInput.classList.add('search_term');
      srchInput.placeholder = 'Поиск';
      srch.appendChild(srchInput);

      const srchBtn = document.createElement('button');
      srchBtn.type = 'submit';
      srchBtn.classList.add('search_button');
      srchBtn.innerHTML = '<i> GO </i>';
      srch.appendChild(srchBtn);

      navigation.appendChild(nav);
      navigation.appendChild(srch);
      return navigation;
    }
}
