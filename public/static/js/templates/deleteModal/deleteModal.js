import deleteModalT from './deleteModal.handlebars';
import './deleteModal.sass';

/**
 * пробрасывает модальное окно
 * @return {*} функцию шаблона минимодального окна
 */
export function createDeleteModal() {
  return deleteModalT;
}
