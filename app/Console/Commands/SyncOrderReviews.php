<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\ProductReview;

class SyncOrderReviews extends Command
{
    protected $signature = 'orders:sync-reviews';
    protected $description = 'Synchronize product reviews for completed orders';

    public function handle()
    {
        $completedOrders = Order::where('status', 'completed')->get();
        $bar = $this->output->createProgressBar(count($completedOrders));

        foreach ($completedOrders as $order) {
            // Get all reviews for this order
            $existingReviews = ProductReview::where('order_id', $order->id)->pluck('product_id')->toArray();
            
            // Load products if not loaded
            if (!$order->relationLoaded('products')) {
                $order->load('products');
            }

            foreach ($order->products as $product) {
                $product->has_review = in_array($product->id, $existingReviews);
            }

            $bar->advance();
        }

        $bar->finish();
        $this->info("\nCompleted orders have been synchronized with their reviews.");
    }
}