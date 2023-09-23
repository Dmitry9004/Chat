/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

import Echo from 'laravel-echo';

import Pusher from 'pusher-js';window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ? import.meta.env.VITE_PUSHER_HOST : `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
    wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
    wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

window.Echo.private('messages')
	 .listen('Message', (e) => {
        const button_input = document.getElementById('button-input');
        if(e.id_chat == button_input.getAttribute('href') || (e.id_user == button_input.getAttribute('href') && document.getElementById('form-input-message').getAttribute('href') == 'user')){
            displayNewMessage(e);
        }
	})
window.Echo.private('chat')
     .listen('Chat', (e)=>{
        displayChat(e);
     });

    async function displayChat(chat){ 
            const div = document.createElement('div');
            const spanLastMessage = document.createElement('span');
            const spanUsername = document.createElement('span');
            const chatsBar = document.getElementById('chats-bar');
            let content = '';
            
            if(chat.id_user != window.userID){
                content = document.createTextNode(chat.username_first);
            }else{
                content = document.createTextNode(chat.username_second);
            }
            console.log(chat);

            spanUsername.appendChild(content);
            spanUsername.setAttribute('id','username');
            spanUsername.setAttribute('href', chat.chat_id);
            div.classList.add('chat-icon');
            div.setAttribute('href', chat.chat_id);
            div.setAttribute('onclick', 'chatMessages()');
            

            spanLastMessage.appendChild(document.createTextNode(chat.last_message));
            spanLastMessage.classList.add('last-message');
            spanLastMessage.setAttribute('href', chat.chat_id);

            div.appendChild(spanUsername);
            div.appendChild(spanLastMessage);
            chatsBar.appendChild(div);         
            }

async function displayNewMessage(e){
    const chat = document.getElementById('chat');
        const message = document.createElement('span');        
        const content = document.createTextNode(e.message);
        message.appendChild(content);
        message.classList.add('message')

        if(e.auth_id_user != window.userID)
           message.classList.add('message-another');

        chat.appendChild(message);
}

