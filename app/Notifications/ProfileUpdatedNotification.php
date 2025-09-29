<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\User;

class ProfileUpdatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $user;
    protected $changes;
    protected $timestamp;
    protected $ipAddress;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user, array $changes)
    {
        $this->user = $user;
        $this->changes = $changes;
        $this->timestamp = now();
        $this->ipAddress = request()->ip();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Profile Updated - Growcery')
            ->greeting('Hello ' . $this->user->full_name . '!')
            ->line('Your profile information has been successfully updated on Growcery.')
            ->line('**Changes made:**')
            ->line($this->formatChanges())
            ->line('**When:** ' . $this->timestamp->format('F j, Y \a\t g:i A'))
            ->line('**From IP:** ' . $this->ipAddress)
            ->line('**Device:** ' . $this->getUserAgent())
            ->line('If you did not make these changes, please contact our support team immediately.')
            ->action('View Your Profile', url('/customer/profile'))
            ->line('Thank you for using Growcery!')
            ->salutation('Best regards, The Growcery Team');
    }

    /**
     * Format the changes for display in the email.
     */
    private function formatChanges(): string
    {
        $formattedChanges = [];
        
        foreach ($this->changes as $field => $values) {
            $fieldName = $this->getFieldDisplayName($field);
            $formattedChanges[] = "• {$fieldName}: Updated";
        }

        return implode("\n", $formattedChanges);
    }

    /**
     * Get user-friendly field names.
     */
    private function getFieldDisplayName(string $field): string
    {
        $fieldNames = [
            'full_name' => 'Full Name',
            'mobile_number' => 'Mobile Number',
            'shipping_address' => 'Shipping Address',
            'email' => 'Email Address',
        ];

        return $fieldNames[$field] ?? ucwords(str_replace('_', ' ', $field));
    }

    /**
     * Get user agent information.
     */
    private function getUserAgent(): string
    {
        $userAgent = request()->userAgent();
        if (!$userAgent) {
            return 'Unknown Device';
        }
        
        // Simplify user agent for readability
        if (strpos($userAgent, 'Chrome') !== false) {
            return 'Chrome Browser';
        } elseif (strpos($userAgent, 'Firefox') !== false) {
            return 'Firefox Browser';
        } elseif (strpos($userAgent, 'Safari') !== false) {
            return 'Safari Browser';
        } elseif (strpos($userAgent, 'Edge') !== false) {
            return 'Edge Browser';
        }
        
        return 'Web Browser';
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'user_id' => $this->user->id,
            'changes' => $this->changes,
            'timestamp' => $this->timestamp,
            'ip_address' => $this->ipAddress,
        ];
    }
}
