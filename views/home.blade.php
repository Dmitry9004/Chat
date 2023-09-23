<!DOCTYPE html>
<html>
<head>
		<title>Home</title>
		@vite(['public/css/home.css'])
		@vite(['resources/js/app.js'])
</head>
<script>
	window.userID = {{ auth()->id()}};
</script>
<body>
	<div id = "chats-bar" class = "chats-bar">
		<div id = "form-user" class = "form-user">
			<!-- <form> -->
				<input id = "input-username" class = "input-username" type="text" name="username" placeholder="Enter username..."></input>
			<!-- </form>	 -->
		</div>
			<div id = "users-bar" class = "users-bar under"></div>
		
	</div>

	<div class = "window" id = "window">
		<div class = "chat" id="chat">	
		</div>
	</div>

	<div id = "log-out" class = "log-out">
		<div class = "gg-log-out">
		</div>
	</div>

<script type="text/javascript" src = "/js/main.js"></script>
</body>	
</html>