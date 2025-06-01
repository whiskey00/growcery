<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    public function switch(Request $request)
    {
        $locale = $request->input('locale');
        
        if (!in_array($locale, ['en', 'tl'])) {
            $locale = config('app.locale');
        }
        
        Session::put('locale', $locale);
        App::setLocale($locale);
        
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Language changed successfully']);
        }
        
        return redirect()->back();
    }
} 