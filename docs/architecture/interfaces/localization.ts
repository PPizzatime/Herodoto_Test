/**
 * Localization (i18n) Structures
 * Defines how content is structured to support multiple languages for guides.
 */

export interface LocalizedString {
  en: string; // Default fallback
  es?: string;
  fr?: string;
  de?: string;
  it?: string;
}

export interface LocalizedGuideLayout {
  type: 'TEXT' | 'IMAGE' | 'PLAY_AUDIO' | 'BUTTON';
  content?: LocalizedString;
  url?: LocalizedString; // Audio URLs might be localized
}

export interface TranslationService {
  /** Automatically translate text using AI or Google Translate */
  translate(text: string, targetLanguage: string): Promise<string>;
}
