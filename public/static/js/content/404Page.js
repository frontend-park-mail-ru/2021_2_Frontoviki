/**
    * Экспортируемый класс для генерации окна с 404 ошибкой
*/
export class ErrorPage {
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
    */
    render() {
      this.#parent.innerHTML = '';
      const content = document.createElement('div');
      content.classList.add('content404');
      const innerContent = document.createElement('div');

      const imgDiv = document.createElement('div');
      imgDiv.classList.add('image404');
      const img = document.createElement('img');
      img.src = '../../static/img/404.png';
      imgDiv.appendChild(img);
      innerContent.appendChild(imgDiv);

      const title = document.createElement('h1');
      title.innerHTML = 'Страница не найдена';
      innerContent.appendChild(title);

      const text = document.createElement('p');
      text.innerHTML = `Похоже, ресурс,
          к которому вы хотите обратиться, не существует`;
      innerContent.appendChild(text);

      const btn = document.createElement('a');
      btn.innerHTML = 'Вернуться на главную';
      btn.href = '';
      btn.dataset.section = 'menu';
      innerContent.appendChild(btn);

      content.appendChild(innerContent);
      this.#parent.appendChild(content);
    }
}
