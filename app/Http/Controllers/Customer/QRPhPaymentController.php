<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Services\PayMongoService;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QRPhPaymentController extends Controller
{
    protected $payMongoService;

    public function __construct(PayMongoService $payMongoService)
    {
        $this->payMongoService = $payMongoService;
    }

    public function generateQR(Request $request)
    {
        try {
            $order = Order::findOrFail($request->order_id);
            
            // Generate QR code
            $qrData = $this->payMongoService->generateQRPh(
                $order->total_price,
                "Payment for Order #{$order->id}",
                $order->id
            );

            return response()->json([
                'success' => true,
                'data' => $qrData
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to generate QR: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate QR code'
            ], 500);
        }
    }

    public function simulatePayment(Request $request)
    {
        try {
            $paymentData = $this->payMongoService->simulatePaymentSuccess($request->reference);
            
            // Update order status
            $order = Order::findOrFail($paymentData['order_id']);
            $order->status = 'to_ship';
            $order->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment successful'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to simulate payment: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment'
            ], 500);
        }
    }
} 