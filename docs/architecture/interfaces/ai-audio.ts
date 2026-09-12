/**
 * AI Audio Generation Interfaces
 * Abstracts the text-to-speech provider (e.g. Google Cloud TTS, ElevenLabs, OpenAI)
 */

export interface AIAudioProvider {
  /**
   * Generates audio from text
   * @param text The script to synthesize
   * @param voiceId The ID of the voice model to use
   * @returns A URL to the generated audio file (hosted on Supabase Storage)
   */
  synthesizeSpeech(text: string, voiceId: string): Promise<string>;
  
  /**
   * List available voices for the current provider
   */
  getAvailableVoices(languageCode?: string): Promise<VoiceModel[]>;
}

export interface VoiceModel {
  id: string;
  name: string;
  language: string;
  previewUrl?: string;
}
