<?php

namespace App\Http\Controllers\Vendor;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $vendorId = Auth::id();
        $status = $request->query('status');

        $ordersQuery = Order::where('vendor_id', $vendorId)
            ->with(['products', 'user']);

        if ($status) {
            $ordersQuery->where('status', $status);
        }

        $orders = $ordersQuery->latest()->paginate(10);

        return Inertia::render('Vendor/Orders/Index', [
            'orders' => $orders,
            'activeStatus' => $status
        ]);
    }

    public function show(Order $order)
    {
        $this->authorize('view', $order);

        if ($order->vendor_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this order.');
        }

        $order->load([
            'products' => function ($q) {
                $q->select('products.id', 'name', 'price')->withPivot('quantity');
            },
            'user:id,full_name,mobile_number' // ✅ Load only needed user fields
        ]);

        return Inertia::render('Vendor/Orders/Show', [
            'order' => $order,
        ]);
    }

    public function destroy(Order $order)
    {
        $this->authorize('delete', $order);

        $order->delete();

        return redirect()->route('vendor.orders.index')->with('success', 'Order deleted.');
    }

    public function update(Request $request, Order $order)
    {
        if ($order->vendor_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:to_pay,to_ship,to_receive,completed,cancelled'
        ]);

        $order->status = $request->status;
        $order->save();

        return redirect()->route('vendor.orders.show', $order->id)
            ->with('success', 'Order status updated!');
    }


}
