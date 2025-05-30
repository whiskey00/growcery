<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VendorApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class VendorApplicationController extends Controller
{
    public function index()
    {
        $applications = VendorApplication::with('user')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/VendorApplications/Index', [
            'applications' => $applications
        ]);
    }

    public function show(VendorApplication $application)
    {
        $application->load('user');

        return Inertia::render('Admin/VendorApplications/Show', [
            'application' => $application,
            'idDocumentUrl' => Storage::disk('private')->url($application->id_document)
        ]);
    }

    public function approve(VendorApplication $application)
    {
        DB::beginTransaction();

        try {
            // Update user role to vendor
            $application->user->update(['role' => 'vendor']);

            // Update application status
            $application->update([
                'status' => 'approved',
                'reviewed_at' => now()
            ]);

            DB::commit();

            return redirect()->route('admin.vendor-applications.index')
                ->with('success', 'Vendor application approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to approve vendor application.');
        }
    }

    public function reject(Request $request, VendorApplication $application)
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500'
        ]);

        $application->update([
            'status' => 'rejected',
            'rejection_reason' => $validated['rejection_reason'],
            'reviewed_at' => now()
        ]);

        return redirect()->route('admin.vendor-applications.index')
            ->with('success', 'Vendor application rejected.');
    }

    public function viewDocument($id)
    {
        $application = \App\Models\VendorApplication::findOrFail($id);
        
        if (!Storage::disk('private')->exists($application->id_document)) {
            abort(404);
        }

        return response()->file(
            Storage::disk('private')->path($application->id_document)
        );
    }

    public function destroy(VendorApplication $application)
    {
        // Delete the ID document file
        if (Storage::disk('private')->exists($application->id_document)) {
            Storage::disk('private')->delete($application->id_document);
        }

        // Delete the application
        $application->delete();

        return redirect()->route('admin.vendor-applications.index')
            ->with('success', 'Vendor application deleted successfully.');
    }
} 