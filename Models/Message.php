<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Message extends Model{


	public $timestamps = false;
	protected $table = 'messages';
	protected $fillable = [
        'id_chat',
        'id_user',
        'content',
        'created_at'
    ];

	public function __construct(){}
}