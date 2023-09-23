<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Chat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $chat_Id;
    public $id_user;
    public $id_auth_user;
    public $username_first;
    public $username_second;
    public $last_message;
    /**
     * Create a new event instance.
     */
    public function __construct($chat_Id, $id_user, $id_auth_user, $username_first, $username_second, $last_message)
    {
        $this->chat_Id = $chat_Id;
        $this->id_user = $id_user;
        $this->id_auth_user = $id_auth_user; 
        $this->username_first = $username_first;
        $this->username_second = $username_second;
        $this->last_message = $last_message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat'),
        ];
    }
}
