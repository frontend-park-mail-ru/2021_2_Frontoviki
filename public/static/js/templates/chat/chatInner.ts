import { templateFunc } from '../../types';
import chatAdvT from './chatAdvBlock.handlebars';

export function createAdvBlock(): HTMLDivElement {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat_order');
    chatDiv.innerHTML = (<templateFunc> chatAdvT)();
    return chatDiv;
}