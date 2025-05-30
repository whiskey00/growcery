<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\VendorApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;

class VendorApplicationController extends Controller
{
    public function create()
    {
        // Check if user already has a pending or approved application
        $existingApplication = VendorApplication::where('user_id', auth()->id())
            ->whereIn('status', ['pending', 'approved'])
            ->first();

        if ($existingApplication) {
            return redirect()->back()->with('error', 'You already have a pending or approved vendor application.');
        }

        $categories = Category::all()->pluck('name');
        \Log::info('Categories fetched:', $categories->toArray());
        
        return Inertia::render('Customer/VendorApplication/Create', [
            'user' => auth()->user(),
            'produceTypes' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'business_name' => 'nullable|string|max:255',
            'farm_address' => 'required|string|max:500',
            'produce_types' => 'required|array|min:1',
            'id_document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'description' => 'nullable|string|max:1000',
            'declaration' => 'required|accepted'
        ]);

        // Store the ID document
        $idPath = $request->file('id_document')->store('vendor-documents', 'private');

        // Create the application
        VendorApplication::create([
            'user_id' => auth()->id(),
            'full_name' => $validated['full_name'],
            'phone_number' => $validated['phone_number'],
            'business_name' => $validated['business_name'],
            'farm_address' => $validated['farm_address'],
            'produce_types' => $validated['produce_types'],
            'id_document' => $idPath,
            'description' => $validated['description'],
            'status' => 'pending'
        ]);

        return redirect()->route('customer.vendor-application.status')
            ->with('success', 'Your vendor application has been submitted successfully. We will review it shortly.');
    }

    public function status()
    {
        $application = VendorApplication::where('user_id', auth()->id())
            ->latest()
            ->first();

        return Inertia::render('Customer/VendorApplication/Status', [
            'application' => $application
        ]);
    }

    public function viewDocument($id)
    {
        $application = VendorApplication::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();
        
        if (!Storage::disk('private')->exists($application->id_document)) {
            abort(404);
        }

        return response()->file(
            Storage::disk('private')->path($application->id_document)
        );
    }
} 