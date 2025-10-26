<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Product;

class ProductExpiring extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Product $product,
        public int $days,
        public string $type
    ) {}

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'date_harvested' => $this->product->date_harvested?->format('Y-m-d'),
            'expiry_date' => $this->product->expiry_date?->format('Y-m-d'),
            'days_until_expiry' => $this->days,
            'type' => $this->type,
            'message' => $this->getMessage(),
        ];
    }

    private function getMessage(): string
    {
        if ($this->type === 'expired') {
            return "Your product '{$this->product->name}' expired {$this->days} day(s) ago.";
        }
        return "Your product '{$this->product->name}' will expire in {$this->days} day(s).";
    }
}
