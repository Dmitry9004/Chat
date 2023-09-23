<?php

namespace App\Services;

use App\Models\Message;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\Chat;
use Illuminate\Support\Carbon;

class UserService{

	public static function allUsers($username){
		try{
			return DB::table('users')
			->where('id', '!=', Auth::id())
			->Where('name','LIKE','%'.$username.'%')
			->get();
		}catch(e){}
	}

	public static function getUserById($id_user){
		try{
			return DB::table('users')->where('id',$id_user)->first();
		}catch(e){}
	}
}