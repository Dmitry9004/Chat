<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Message implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $message;
    public $auth_id_user;
    public $id_chat;
    public $id_user;
    /**
     * Create a new event instance.
     */
    public function __construct($message,$auth_id_user, $id_chat,$id_user)
    {
        $this->message = $message;
        $this->auth_id_user = $auth_id_user;
        $this->id_chat = $id_chat;
        $this->id_user = $id_user;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('messages'),
        ];
    }
}
