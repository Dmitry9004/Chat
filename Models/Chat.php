<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat extends Model{

	public $timestamps = false;
	protected $table = 'chats';
	protected $fillable = [
        'id_user',
        'id_user_another',
    ];

	public function __construct(){}
}