/**
 * Generic class for providing language based functionality
 *
 *
 **/

export class LanguageFeatureRegistry<T> {

  // ------------------------------------------------------------------------

  private dict: Map<string, T> = new Map();

  // ------------------------------------------------------------------------

  has(language: string): boolean
  {
    return this.dict.has(language);
  }

  // ------------------------------------------------------------------------
  /**
   *  Register a generic object to use with a given language.
   *  New registrations of the same language overwrite old ones
   **/
  register(language: string, provider: T): void // IDisposable
  {
    this.dict.set(language.toLowerCase(),provider);
  }

  // ------------------------------------------------------------------------

  /**
   * get previously registered object for a specified language
   **/
  get(language: string): T | undefined
  {
    return this.dict.get(language.toLowerCase());
  }

  // ------------------------------------------------------------------------


}