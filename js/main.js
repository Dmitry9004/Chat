	document.body.onload = allChats;
	document.getElementById('input-username').addEventListener('input',findUsers);
	document.getElementById('input-username').addEventListener('click', displayUsersBar);
	document.getElementById('chat').addEventListener('scroll',getMessagesAfterScroll);
	document.getElementById('log-out').addEventListener('click', logOut);

	async function logOut(){
		try{
			const response = await fetch('/logout', {
			method:'GET'
			});
		}catch(e){}
	}

	async function displayUsersBar(){
		if(document.getElementById('users-bar').classList.contains('under')){
			document.getElementById('users-bar').classList.remove('under');
			document.getElementById('chats-bar').classList.add('overflow-hidden');
			document.getElementById('users-bar').classList.add('chats-bar');

			const span = document.createElement('span');
			const i = document.createElement('i');
			
			span.classList.add('arrow-left');
			i.classList.add('gg-arrow-left'); 
			i.setAttribute('id','gg-arrow-left')
			i.onclick = removeUsersBar;
			span.appendChild(i);
			document.getElementById('form-user').appendChild(span);	
		}
	}

	async function removeUsersBar(){
		document.getElementById('users-bar').classList.add('under');
		document.getElementById('gg-arrow-left').remove();
		document.getElementById('chats-bar').classList.remove('overflow-hidden');
	}

	async function findUsers(){
		try{
			const username = document.getElementById('input-username').value;
			const response = await fetch('/users', {
				method:"POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({username:username})
			});
			const responseJson = await response.json();
			displayUsers(responseJson);
		}catch(e){}
	}

	async function displayUsers(responseJson){
		document.getElementById('users-bar').innerText = "";

		const users = await responseJson.users;
		const chat = document.getElementById('users-bar');

		if(users.length == 0){
			displayEmptyRes(chat);
			return;
		}
		displayUsersInUsersBar(chat, users);

		chat.scrollTop = chat.scrollHeight;
	}

	function displayEmptyRes(chat){
		const span = document.createElement('span');
			span.innerHTML = "No results";
			span.classList.add('message-no-res');
			chat.appendChild(span);
	}

	function displayUsersInUsersBar(chat, users){
		for(let i = 0; i < users.length; i++){
		const span = document.createElement('span');
			const username = document.createTextNode(users[i].name);
			span.appendChild(username);
			span.classList.add('user');
			span.setAttribute('onclick', 'getChatMessagesByUserAndDisplayChat()');
			span.setAttribute('id', 'username');
			span.setAttribute('href',users[i].id);
			chat.appendChild(span);
		}
	}

	async function getChatMessagesByUserAndDisplayChat(take = 20, skip = 0, isNewLoadMessages = true){
		const idUserAnother = event.target.getAttribute('href');
		const chat =  document.getElementById('chat');
		let username = getUsername('users-bar', idUserAnother);

		try{
			const response = await fetch('/chatmessagesbyuser',{
				method:"POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({idUserAnother:idUserAnother, skip: skip, take: take})
			});
			const responseJson = await response.json();
		
			if(skip == 0)
			  	document.getElementById('chat').innerHTML = "";
			  
			 if(document.getElementById('form-input-message') != null){
			 	document.getElementById('form-input-message').innerHTML	= "";
			 	document.getElementById('form-input-message').remove();
			 }

			displayMessages(responseJson.chatMessages, idUserAnother,  responseJson.authUserId, isNewLoadMessages);
			createInputMessageFormForUser(chat, idUserAnother, responseJson.authUserId);
			displayUserBar(username);
		
		}catch(e){}
	}

	function getUsername(bar, idUserAnother){ 
		const users = document.getElementById(bar).childNodes;
		for(let i = 0; i < users.length; i++){
			if(users[i].getAttribute('href') == idUserAnother){
				 return users[i].innerText; 
			}
		} 
	}

	async function getChatMessagesAndDisplayChat(take = 20, skip = 0, isNewLoadMessages = true){
		const id = event.target.getAttribute('href');
		const chat = document.getElementById('chat');
		let username = event.target.getAttribute('id') == 'username' ?event.target.childNodes[0].innerText : event.target.parentNode.childNodes[0].innerText;

		if(username == undefined && isNewLoadMessages){
				username = getUsername('chats-bar', id);
		}

		try{
			const response = await fetch('/chatmessages',{
				method:"POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({id:id, skip: skip, take: take})
			});
			const responseJson = await response.json();
		
			if(skip == 0)
		  	document.getElementById('chat').innerHTML = "";

			if(document.getElementById('form-input-message') != null){
				document.getElementById('form-input-message').innerHTML	= "";
				document.getElementById('form-input-message').remove();
			}

			displayMessages(responseJson.chatMessages, id,  responseJson.authUserId, isNewLoadMessages);
			createInputMessageForm(chat, id, responseJson.authUserId);
		
			if(isNewLoadMessages)
				displayUserBar(username);
			
		}catch(e){}
	}

	async function displayUserBar(username){
		if(document.getElementById('username-bar') != null)
			document.getElementById('username-bar').remove();
		
		const div = document.createElement('div');
		const span = document.createElement('span');
		div.classList.add('username-bar');
		div.setAttribute('id','username-bar');
		span.classList.add('username-bar-name');
		span.appendChild(document.createTextNode(username));
		div.appendChild(span);
		document.getElementById('window').appendChild(div);
	}

	async function displayMessages(responseJson, id, authUserId, isNewLoadMessages = true){
		const messages = responseJson;
		console.log(messages); 
		const messagesExist = document.getElementById('chat').childNodes; 
		const chat = document.getElementById('chat');

		for(let i = 0; i < messages.length; i++){
			const div = document.createElement('div');
			const span = document.createElement('span');
			const content = document.createTextNode(messages[i].content);
			span.appendChild(content);
			div.classList.add('message');

			if(messages[i].id_user != authUserId)
				div.classList.add('message-another');

			div.appendChild(span);
			chat.prepend(div);
	}
		chat.setAttribute('href', id);

		if(isNewLoadMessages)
			document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
	}

	async function sendMessage(){
		const message = getMessage();
		const idUserAnother = event.target.getAttribute('href');
		let isUser = false;

		if(event.target.getAttribute('href') == 'user'){
			isUser = true;
			event.target.setAttribute('href','user');
		}
		const chat = document.getElementById('chat');

		const response = await fetch("/message", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({idUserAnother:idUserAnother, message: message, isUser: isUser}),
		});

		chat.scrollTop = chat.scrollHeight;
		document.getElementById('message').value = "";
		console.log(response.json());
	}


	async function sendMessageByUser(){
		const message = getMessage();
		const idUserAnother = event.target.getAttribute('href');
		const chat = document.getElementById('chat');

		const response = await fetch("/messagebyuser", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({idUserAnother: idUserAnother, message: message}),
		});

		chat.scrollTop = chat.scrollHeight;
		document.getElementById('message').value = "";
	}


	function getMessage(){
		return document.getElementById('message').value;
	}

	function createInputMessageFormForUser(chat, idUserAnother, idAuthUser){
		const div = document.createElement('div');
		setAttributeFormInputMessage(div);

		const inputMessage = document.createElement('input');
		setAttributeInputMessage(inputMessage);		

		const inputButton = document.createElement('input');
		setAttributeInputButton(inputButton, idUserAnother, 'sendMessageByUser()');

		div.appendChild(inputMessage);
		div.appendChild(inputButton);
		document.getElementById('window').appendChild(div);
	}

	function createInputMessageForm(chat, idUserAnother, idAuthUser){

		const div = document.createElement('div');
		setAttributeFormInputMessage(div);

		const inputMessage = document.createElement('input');
		setAttributeInputMessage(inputMessage);
		
		const inputButton = document.createElement('input');
		setAttributeInputButton(inputButton, idUserAnother, 'sendMessage()');

		div.appendChild(inputMessage);
		div.appendChild(inputButton);
		document.getElementById('window').appendChild(div);
	}

	function setAttributeFormInputMessage(div){
		div.classList.add('form-input-message');
		div.setAttribute('id', 'form-input-message');
		div.setAttribute('href','user');
	}

	function setAttributeInputMessage(inputMessage){
		inputMessage.classList.add('message-field');
		inputMessage.setAttribute('id', 'message');
		inputMessage.setAttribute('type','text')
	}

	function setAttributeInputButton(inputButton, idUserAnother, messageFunction){
		inputButton.classList.add('button-input');
		inputButton.setAttribute('type','button');
		inputButton.setAttribute('id', 'button-input');
		inputButton.setAttribute('href', idUserAnother);
		inputButton.setAttribute('value', 'Submit');
		inputButton.setAttribute('onclick', messageFunction);
	}


	async function getMessagesAfterScroll(){
		if(document.getElementById('chat').scrollTop != 0){
			return;
		}
		if(document.getElementById('form-input-message').getAttribute('href') == 'user'){
			getchatMessagesByUserAndDisplayChat(20, document.getElementsByClassName('message').length, false);
		}else{
			getChatMessagesAndDisplayChat(20, document.getElementsByClassName('message').length, false);
		}
	}

	async function allChats(){
		try{
			const response = await fetch('/chats', {

				method: "GET",
				headers: {
					"Content-Type": "application/json",							
				}
			});
		const responseJson = await response.json();
		displayChats(responseJson);
		}catch(e){}
	}	
	async function displayChats(responseJson){ 
		const chats =  responseJson.chats;
		const authUserId = responseJson.authUserId;
		const chatsBar = document.getElementById('chats-bar');

		for(let i = 0; i < chats.length;i++){

			const div = document.createElement('div');
			const spanLastMessage = document.createElement('span');
			const spanUsername = document.createElement('span');
			let content = getContentToUsernameView(chats[i], authUserId);

     		spanUsername.appendChild(content);
     		spanUsername.setAttribute('href', chats[i].id);

     		setAttributeChatIcon(div, chats[i].id);

       		spanLastMessage.appendChild(document.createTextNode(chats[i].last_message));
       		spanLastMessage.classList.add('last-message');
       		spanLastMessage.setAttribute('href', chats[i].id);

       		div.appendChild(spanUsername);
       		div.appendChild(spanLastMessage);
       		chatsBar.appendChild(div);			
		}
	}

	function setAttributeChatIcon(div, id){
	    div.classList.add('chat-icon');
      	div.setAttribute('href', id);
       	div.setAttribute('onclick', 'getChatMessagesAndDisplayChat()');
     	div.setAttribute('id','username');
	}
	function getContentToUsernameView(chat, authUserId){
		if(chat.id_user != authUserId){
				return document.createTextNode(chat.username_first);
		}else{
				return document.createTextNode(chat.username_second);
		}	
	}
