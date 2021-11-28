import { templateFunc } from '../../types';
import chatMessageT from './chatMessage.handlebars';

export function createChatMessage(message: string, sendTime:string, isCompanion: boolean): HTMLDivElement {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat_history_element');
    messageDiv.innerHTML = (<templateFunc>chatMessageT)({text: message, time:sendTime, companion: isCompanion})
    return messageDiv;
}