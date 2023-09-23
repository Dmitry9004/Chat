<?php 

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\MessageService;
use App\Services\ChatService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use App\Events\Message;
use App\Events\Chat;

class UserController{

	public function index(Request $request){
		$users = UserService::allUsers($request->get('username'));
		return response()->json(['users'=>$users]);
	}

	public function show(Request $request){
    	$chatExist = ChatService::findChatByIdUser(Auth::id(), $request->get('idUserAnother'));
		$messages = "";
        if(isset($chatExist))
            $messages = MessageService::getAllMessageFromChatByIdChat($chatExist->id, $request->get('skip'), $request->get('take'));
        
        return response()->json(['chatMessages'=>$messages, 'authUserId'=>Auth::id()]);
	}

	public function store(Request $request){
		$chatExist = ChatService::findChatByIdUser(Auth::id(), $request->get('idUserAnother'));
		$isSend = MessageService::sendMessageToChatAndCreateChat($request, $chatExist);
        return response()->json(["message"=>true]);
	}
}