import { templateFunc } from '../../types';
import chatInputT from './chatInput.handlebars';

export function createChatInput(): HTMLDivElement {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat_input');
    chatDiv.innerHTML = (<templateFunc> chatInputT)();
    return chatDiv;
}