<?php

namespace App\Services;

 use Illuminate\Support\Facades\DB;
 use Illuminate\Support\Carbon;
 use App\Services\UserService;
 use App\Services\ChatService;
 use Illuminate\Support\Facades\Auth;
 use App\Events\Chat;
 use App\Models\Message;
 use App\Events\Message as MessageEvent; 

class MessageService{

	public static function sendMessageToChatAndCreateChat($request, $chatExist){
        try{
	       	$idUserAnother = $request->get('idUserAnother');
	        $chat = "";

	        if(isset($chatExist)){
	        	$chat = $chatExist;
	            self::updateLastMessage($chat->id, $request->get('message'));
	        }else{
	            $usernameFirst = UserService::getUserById(Auth::id());
	            $usernameSecond = UserService::getUserById($idUserAnother);
	            $newChat = ChatService::createChat(Auth::id(), $idUserAnother, $usernameFirst->name, $usernameSecond->name, $request->get('message'));
	            $chat = $newChat;
	            event(new Chat($chat->id, $chat->id_user, Auth::id(), $chat->username_first, $chat->username_second, $chat->last_message)); 
	        }

	        self::sendMessage($request->get('message'), $chat->id);
        	event(new MessageEvent($request->get('message'), Auth::id(), $chat->id, $idUserAnother));
        	return true;
        }catch(e){}
    }

	public static function sendMessage($mes, $chat_id){
		try{
			$message = new Message();
			$message->id_chat = $chat_id;
			$message->id_user = Auth::id();
			$message->content = $mes;
			$message->created_at = now();
			$message->save();
		}catch(e){}
	}

	public static function getAllMessageFromChatByIdChat($id_chat, $skip, $take){
		try{
			return DB::table('messages')->where('id_chat',$id_chat)
									->offset($skip)
									->limit($take)
									->orderBy('created_at', 'desc')
									->get();
		}catch(e){}
	}

	public static function updateLastMessage($id_chat, $message){
		try{
			DB::table('chats')->where('id', $id_chat)->update(['last_message' => $message]);
		}catch(e){}
	}
}
