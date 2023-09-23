<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\MessageService;
use Illuminate\Support\Facades\Auth;
use App\Events\Chat;
use App\Services\UserService;
use App\Services\ChatService;

class ChatController extends Controller
{   
    public function index(){
        $chats = ChatService::getAllChats(Auth::id());
        return response()->json(["chats"=>$chats, "authUserId"=>Auth::id()]);
    }

    public function show(Request $request){
        $chatExist = ChatService::findChatByIdChat($request->get('id'));
        $messages = "";
        if(isset($chatExist))
            $messages = MessageService::getAllMessageFromChatByIdChat($chatExist->id, $request->get('skip'), $request->get('take'));
        
        return response()->json(['chatMessages'=>$messages, 'authUserId'=>Auth::id()]);
    }
}
