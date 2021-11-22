import chatMessageT from './chatMessage.handlebars';

export function createChatMessage(message: string, sendTime:string): HTMLDivElement {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('user-message');
    messageDiv.innerHTML = chatMessageT({text: message, time:sendTime})
    return messageDiv;
}