<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'name_tagalog', 'slug', 'status'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Get the translated name for the category
     */
    public function getTranslatedNameAttribute()
    {
        $locale = app()->getLocale();
        
        // If it's English, return the original name
        if ($locale === 'en') {
            return $this->name;
        }
        
        // For Tagalog, return the Tagalog name if available
        if ($locale === 'tl' && $this->name_tagalog) {
            return $this->name_tagalog;
        }
        
        // Fallback to original name if no Tagalog translation found
        return $this->name;
    }

    /**
     * Get the display name (translated if available)
     */
    public function getDisplayNameAttribute()
    {
        return $this->translated_name;
    }

    /**
     * Get the name in a specific language
     */
    public function getNameInLanguage($locale = 'en')
    {
        if ($locale === 'tl' && $this->name_tagalog) {
            return $this->name_tagalog;
        }
        
        return $this->name;
    }
}



