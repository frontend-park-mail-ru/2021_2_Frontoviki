import newAdFormT from './newAdForm.handlebars';
import './new_advert.css';
import './radio_button.css';
import './textarea.css';
import './select.css';

/**
 * Пробрасывает шаблон во вьюху
 * @return {string} шаблон формы нового объявления
 */
export function createNewAdForm() {
  return newAdFormT;
}
