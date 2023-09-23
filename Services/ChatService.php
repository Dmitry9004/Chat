<?php
namespace App\Services;

use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Chat;
use Illuminate\Support\Carbon;

class ChatService{
		
	public static function getAllChats($id_user){
		try{
			$first_row = DB::table('chats')->where('id_user', $id_user)
										   ->where('id_user_another', '!=', $id_user)
										   ->get();
			$second_row = DB::table('chats')->where('id_user_another', $id_user)
											->where('id_user', '!=', $id_user)
										    ->get();
			return $first_row->merge($second_row);
		}catch(e){}
	}	
	public static function createChat($id_user, $id_user_another, $first_username, $second_username, $last_message){
		try{
			$chat = new Chat();
			$chat->id_user = $id_user;
			$chat->id_user_another = $id_user_another;
			$chat->username_first = $first_username;
			$chat->username_second = $second_username;
			$chat->last_message = $last_message;
			$chat->save();
			return $chat;
		}catch(e){}
	}

	public static function findChatByIdUser($id_user, $id_user_another){
		try{
			$first_prompt = DB::table('chats')
						->where('id_user', $id_user)
						->where('id_user_another', $id_user_another)
						->first();
			$second_prompt = DB::table('chats')
						->where('id_user', $id_user_another)
						->where('id_user_another', $id_user)
						->first();

			return null!=$first_prompt?$first_prompt:$second_prompt;
		}catch(e){}
	}

	public static function findChatByIdChat($id_chat){
		try{
			return DB::table('chats')->where('id',$id_chat)->first();
		}catch(e){}
	}
}