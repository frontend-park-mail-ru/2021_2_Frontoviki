import footerT from './footer.handlebars';
import './footer.css';
/**
  * Создает футер и цепляет его в основной div 'wrapper'
  * Важно, что функция запускается после создания root,
  * в котором лежит основной контент страницы
*/
export function createFooter() {
  const footer = document.createElement('footer');
  footer.innerHTML = footerT({footerText: '© 2021. Volchock team'});
  document.querySelector('.wrapper').appendChild(footer);
}


