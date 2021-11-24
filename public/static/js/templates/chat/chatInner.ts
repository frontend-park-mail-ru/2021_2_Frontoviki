import { templateFunc } from '../../types';
import chatInnerT from './chatInner.handlebars';

export function chatMessagesBlock(): HTMLDivElement {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chats-message');
    chatDiv.innerHTML = (<templateFunc> chatInnerT)();
    return chatDiv;
}