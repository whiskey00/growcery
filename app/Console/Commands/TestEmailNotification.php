<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\ProfileUpdatedNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmailNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:email-notification {email?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test the email notification system for profile updates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        
        if (!$email) {
            $email = $this->ask('Enter email address to test with');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('Invalid email address provided.');
            return 1;
        }

        $this->info('Testing email configuration...');

        try {
            // Test basic email sending
            $this->info('1. Testing basic SMTP connection...');
            Mail::raw('Test email from Growcery via Hostinger SMTP', function ($message) use ($email) {
                $message->to($email)->subject('Growcery SMTP Test');
            });
            $this->info('✅ Basic email test sent successfully!');

            // Test profile notification
            $this->info('2. Testing profile update notification...');
            
            // Create a test user or use existing
            $testUser = new User([
                'full_name' => 'Test User',
                'email' => $email,
                'mobile_number' => '09123456789',
                'shipping_address' => '123 Test Street, Test City'
            ]);

            $testChanges = [
                'full_name' => ['old' => 'Old Name', 'new' => 'Test User'],
                'shipping_address' => ['old' => 'Old Address', 'new' => '123 Test Street, Test City']
            ];

            // Send notification
            $notification = new ProfileUpdatedNotification($testUser, $testChanges);
            $mailMessage = $notification->toMail($testUser);
            
            Mail::send([], [], function ($message) use ($email, $mailMessage) {
                $message->to($email)
                    ->subject($mailMessage->subject)
                    ->html($this->renderMailMessage($mailMessage));
            });

            $this->info('✅ Profile update notification sent successfully!');

            $this->newLine();
            $this->info('🎉 Email notification system is working!');
            $this->info('Check your email inbox (and spam folder) for the test messages.');
            $this->newLine();
            $this->info('Configuration being used:');
            $this->line('MAIL_HOST: ' . config('mail.mailers.smtp.host'));
            $this->line('MAIL_PORT: ' . config('mail.mailers.smtp.port'));
            $this->line('MAIL_FROM: ' . config('mail.from.address'));

        } catch (\Exception $e) {
            $this->error('❌ Email test failed!');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            $this->info('Troubleshooting steps:');
            $this->line('1. Check your .env file configuration');
            $this->line('2. Verify Hostinger email account credentials');
            $this->line('3. Ensure your domain email is properly set up');
            $this->line('4. Try different port (587 vs 465) or encryption (tls vs ssl)');
            
            return 1;
        }

        return 0;
    }

    /**
     * Render mail message to HTML
     */
    private function renderMailMessage($mailMessage): string
    {
        $html = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">';
        
        if ($mailMessage->greeting) {
            $html .= '<h2>' . $mailMessage->greeting . '</h2>';
        }

        foreach ($mailMessage->introLines as $line) {
            $html .= '<p>' . $line . '</p>';
        }

        if ($mailMessage->actionText && $mailMessage->actionUrl) {
            $html .= '<p><a href="' . $mailMessage->actionUrl . '" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">' . $mailMessage->actionText . '</a></p>';
        }

        foreach ($mailMessage->outroLines as $line) {
            $html .= '<p>' . $line . '</p>';
        }

        if ($mailMessage->salutation) {
            $html .= '<p>' . $mailMessage->salutation . '</p>';
        }

        $html .= '</div>';
        
        return $html;
    }
}
