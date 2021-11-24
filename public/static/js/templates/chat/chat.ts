import { templateFunc } from '../../types';
import chatT from './chat.handlebars';
import './chat.sass';

export function chatTemplateGenerator(): templateFunc {
  return <templateFunc> chatT;
}