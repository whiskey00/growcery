<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\User;
use App\Notifications\ProductExpiring;
use Illuminate\Support\Facades\Notification;

class CheckProductExpiry extends Command
{
    protected $signature = 'products:check-expiry';
    protected $description = 'Check for products nearing expiry and send notifications to vendors';

    public function handle()
    {
        $warningDays = config('growcery.expiry_warning_days', 3);
        
        // Get products with both fields set
        $products = Product::whereNotNull('date_harvested')
            ->whereNotNull('expected_lifespan_days')
            ->with('vendor')
            ->get();

        $expiredCount = 0;
        $nearExpiryCount = 0;

        foreach ($products as $product) {
            $daysUntilExpiry = $product->days_until_expiry;
            
            if ($daysUntilExpiry === null) {
                continue;
            }

            if ($daysUntilExpiry <= 0) {
                // Product is expired
                $product->vendor->notify(new ProductExpiring($product, abs($daysUntilExpiry), 'expired'));
                $expiredCount++;
            } elseif ($daysUntilExpiry <= $warningDays) {
                // Product is near expiry
                $product->vendor->notify(new ProductExpiring($product, $daysUntilExpiry, 'near_expiry'));
                $nearExpiryCount++;
            }
        }

        $this->info("Checked {$products->count()} products with expiry data.");
        $this->info("Sent {$expiredCount} expired notifications.");
        $this->info("Sent {$nearExpiryCount} near-expiry notifications.");
        
        return Command::SUCCESS;
    }
}
