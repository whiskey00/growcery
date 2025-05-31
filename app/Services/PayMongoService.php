<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class PayMongoService
{
    protected $secretKey;
    protected $baseUrl = 'https://api.paymongo.com/v1';

    public function __construct()
    {
        $this->secretKey = env('PAYMONGO_SECRET_KEY');
    }

    public function generateQRPh($amount, $description, $orderId)
    {
        // For testing purposes, we'll simulate the QR generation
        // In production, you would make a real API call to PayMongo
        
        // Generate a unique reference number
        $reference = 'TEST-' . strtoupper(uniqid()) . '-' . $orderId;
        
        // Store the payment details in cache for 10 minutes
        Cache::put("qr_payment_{$reference}", [
            'amount' => $amount,
            'description' => $description,
            'order_id' => $orderId,
            'status' => 'pending'
        ], 600);

        // Return a simulated QR code data
        return [
            'reference' => $reference,
            'qr_string' => "00020101021226720011ph.ppmi.p2m0111PAYMONGOTST5204000053037045802PH5924Test%20Merchant%20Name%206015Metro%20Manila62290525{$reference}6304" . $this->calculateCRC16CCITT("test"),
        ];
    }

    public function simulatePaymentSuccess($reference)
    {
        $paymentData = Cache::get("qr_payment_{$reference}");
        
        if (!$paymentData) {
            throw new \Exception('Payment reference not found');
        }

        // Update the payment status in cache
        $paymentData['status'] = 'paid';
        Cache::put("qr_payment_{$reference}", $paymentData, 600);

        return $paymentData;
    }

    protected function calculateCRC16CCITT($data)
    {
        // This is a simplified CRC16-CCITT implementation for testing
        // In production, you would use the actual CRC16-CCITT algorithm
        return '0000';
    }
} 