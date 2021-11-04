import newAdFormT from './newAdForm.handlebars';
import './new_advert.sass';
import './radio_button.sass';
import './textarea.sass';
import './select.sass';

/**
 * Пробрасывает шаблон во вьюху
 * @return {string} шаблон формы нового объявления
 */
export function createNewAdForm() {
  return newAdFormT;
}
