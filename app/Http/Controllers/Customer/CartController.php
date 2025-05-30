<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    private function formatCartItems($cartItems)
    {
        return $cartItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->product->name,
                'image' => $item->product->image,
                'vendor' => $item->product->vendor,
                'quantity' => $item->quantity,
                'selectedOption' => [
                    'label' => $item->option_label,
                    'price' => $item->option_price,
                ],
            ];
        });
    }

    public function index(): Response
    {
        $cartItems = auth()->user()->cartItems()
            ->with(['product' => function ($query) {
                $query->with('vendor');
            }])
            ->get();

        return Inertia::render('Customer/Cart/Index', [
            'cartItems' => $this->formatCartItems($cartItems),
        ]);
    }

    public function add(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'selectedOption.label' => 'required|string',
            'selectedOption.price' => 'required|numeric|min:0',
            'update_existing' => 'boolean',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // Check if product is in stock
        if ($product->quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available.',
            ], 422);
        }

        // Check if option exists in product
        $optionExists = collect($product->options)->contains(function ($option) use ($validated) {
            return $option['label'] === $validated['selectedOption']['label'] &&
                   (float) $option['price'] === (float) $validated['selectedOption']['price'];
        });

        if (!$optionExists) {
            return response()->json([
                'message' => 'Invalid product option.',
            ], 422);
        }

        // Check if item already exists in cart
        $existingItem = CartItem::where([
            'user_id' => auth()->id(),
            'product_id' => $validated['product_id'],
            'option_label' => $validated['selectedOption']['label'],
        ])->first();

        if ($existingItem && $request->boolean('update_existing')) {
            // Update existing item's quantity
            $newQuantity = $existingItem->quantity + $validated['quantity'];
            
            // Check if new total quantity exceeds stock
            if ($product->quantity < $newQuantity) {
                return response()->json([
                    'message' => 'Not enough stock available for the requested quantity.',
                ], 422);
            }

            $existingItem->update([
                'quantity' => $newQuantity,
            ]);
        } else {
            // Create new cart item
            CartItem::create([
                'user_id' => auth()->id(),
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'option_label' => $validated['selectedOption']['label'],
                'option_price' => $validated['selectedOption']['price'],
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully.',
        ]);
    }

    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if product has enough stock
        if ($cartItem->product->quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available.',
            ], 422);
        }

        $cartItem->update([
            'quantity' => $validated['quantity'],
        ]);

        return response()->json([
            'message' => 'Cart item updated successfully.',
        ]);
    }

    public function destroy(CartItem $cartItem): JsonResponse
    {
        // Ensure the cart item belongs to the authenticated user
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $cartItem->delete();

        return response()->json([
            'message' => 'Cart item removed successfully.',
        ]);
    }
}
