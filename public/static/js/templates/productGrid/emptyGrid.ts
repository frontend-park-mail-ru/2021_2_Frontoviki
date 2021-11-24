import { templateFunc } from '../../types';
import emptyGridT from './emptyGrid.handlebars';

/**
 * Проброс шаблона из handlebars
 * @return {*}
 */
export function emptyGrid():templateFunc {
  return <templateFunc>emptyGridT;
}
