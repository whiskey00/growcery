<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Order;
use App\Models\ProductReview;

return new class extends Migration
{
    public function up(): void
    {
        // First, ensure all completed orders have the correct status format
        DB::table('orders')
            ->where('status', 'COMPLETED')
            ->update(['status' => 'completed']);

        // Create a seeder command that can be run manually if needed
        $this->createReviewSeederCommand();
    }

    private function createReviewSeederCommand()
    {
        $command = <<<'ARTISAN'
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
ARTISAN;

        // Create the command file
        if (!file_exists(app_path('Console/Commands'))) {
            mkdir(app_path('Console/Commands'), 0755, true);
        }
        file_put_contents(
            app_path('Console/Commands/SyncOrderReviews.php'),
            $command
        );
    }

    public function down(): void
    {
        // Remove the seeder command
        @unlink(app_path('Console/Commands/SyncOrderReviews.php'));
    }
}; 