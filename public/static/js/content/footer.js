/**
  * Создает футер и цепляет его в основной div 'wrapper'
  * Важно, что функция запускается после создания root,
  * в котором лежит основной контент страницы
*/
export function createFooter() {
  const wrapper = document.querySelector('.wrapper');
  const footer = document.createElement('footer');
  footer.innerHTML = '<p>© 2021. Volchock team</p>';
  wrapper.appendChild(footer);
}
