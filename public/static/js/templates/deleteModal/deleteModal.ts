import { templateFunc } from '../../types';
import deleteModalT from './deleteModal.handlebars';
import './deleteModal.sass';

export function createDeleteModal(): templateFunc {
  return <templateFunc>deleteModalT;
}
