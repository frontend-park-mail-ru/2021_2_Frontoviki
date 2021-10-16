/**
  * Создает футер и цепляет его в основной div 'wrapper'
  * Важно, что функция запускается после создания root,
  * в котором лежит основной контент страницы
*/
export function createFooter() {
  const footerTemplate = Handlebars.templates.footer;
  const footer = document.createElement('footer');
  footer.innerHTML = footerTemplate({footerText: '© 2021. Volchock team'});
  document.querySelector('.wrapper').appendChild(footer);
}


