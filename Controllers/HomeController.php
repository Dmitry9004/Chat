<?php

namespace App\Http\Controllers;

use App\Services\MessageService;
use App\Services\UserService;
use App\Services\ChatService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\Message;
use App\Events\Chat;

class HomeController extends Controller
{
     public function index(){
        return view('home');
    }

    public function logout(){
        Auth::logout();
        return redirect('/login');
    }

    public function store(Request $request){
        $chatExist = ChatService::findChatByIdChat($request->get('idUserAnother'));
        $isSend = MessageService::sendMessageToChatAndCreateChat($request, $chatExist);
        return response()->json(["message"=>$isSend]);
    }
}
