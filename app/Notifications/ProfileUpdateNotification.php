<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProfileUpdateNotification extends Notification
{
    use Queueable;

    private $changes;
    private $user;

    public function __construct($user, $changes)
    {
        $this->user = $user;
        $this->changes = $changes;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $message = (new MailMessage)
            ->subject('Profile Updated - Growcery')
            ->greeting('Hello ' . $this->user->name . '!')
            ->line('Your profile has been successfully updated.')
            ->line('Updated information:');

        foreach ($this->changes as $field => $change) {
            $fieldName = $this->getFieldDisplayName($field);
            $message->line("• {$fieldName}: {$change['new']}");
        }

        return $message
            ->line('If you did not make these changes, please contact our support team immediately.')
            ->action('View Profile', url('/customer/profile'))
            ->line('Thank you for using Growcery!');
    }

    private function getFieldDisplayName($field)
    {
        $displayNames = [
            'name' => 'Full Name',
            'email' => 'Email Address',
            'mobile_number' => 'Mobile Number',
            'shipping_address' => 'Shipping Address',
        ];

        return $displayNames[$field] ?? ucfirst(str_replace('_', ' ', $field));
    }
}
