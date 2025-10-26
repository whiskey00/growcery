/**
 * Category translation utility
 * Handles translation of category names from English to Tagalog
 */

export const translateCategory = (categoryName, t) => {
  if (!categoryName) return '';
  
  // Convert category name to translation key format
  const translationKey = `categories.${categoryName.toLowerCase().replace(/\s+/g, '')}`;
  
  // Try to get translation, fallback to original name
  const translated = t(translationKey, categoryName);
  
  // If translation is the same as the key, it means no translation exists
  return translated === translationKey ? categoryName : translated;
};

/**
 * Category mappings for the specific categories needed
 */
export const categoryMappings = {
  'fruits': 'Prutas',
  'grains': 'Butil',
  'leafy greens': 'Madahong Gulay',
  'root crops': 'Tubers',
  'vegetables': 'Gulay'
};

/**
 * Get category translation with fallback
 * This function now works with database-stored translations
 */
export const getCategoryTranslation = (category, t, i18n) => {
  if (!category) return '';
  
  // If category is an object with name_tagalog property, use it
  if (typeof category === 'object' && category.name_tagalog) {
    const locale = i18n?.language || 'en';
    return locale === 'tl' ? category.name_tagalog : category.name;
  }
  
  // Fallback for string category names (legacy support)
  if (typeof category === 'string') {
    // First try the translation system
    const translationKey = `categories.${category.toLowerCase().replace(/\s+/g, '')}`;
    const translated = t(translationKey, category);
    
    // If translation exists and is different from key, return it
    if (translated !== translationKey) {
      return translated;
    }
    
    // Fallback to direct mapping
    const directTranslation = categoryMappings[category.toLowerCase()];
    if (directTranslation) {
      return directTranslation;
    }
    
    // Final fallback to original name
    return category;
  }
  
  // Final fallback
  return category?.name || category || '';
};
