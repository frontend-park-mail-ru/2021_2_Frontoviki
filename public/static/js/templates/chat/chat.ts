import { templateFunc } from '../../types';
import chatToogleT from './chatToogle.handlebars';
import chatT from './chatDialogs.handlebars';
import './chat.sass';

export function chatTemplateGenerator(): templateFunc {
  return <templateFunc> chatT;
}

export function chatToogleTemplateGenerator(): templateFunc {
  return <templateFunc> chatToogleT;
}