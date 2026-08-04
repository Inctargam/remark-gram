/**
 * Ambient types for the reCAPTCHA Enterprise script loaded from Google's CDN.
 *
 * The script assigns `window.grecaptcha` at runtime, so the property is optional:
 * it is absent until the script finishes loading.
 */

interface RecaptchaRenderOptions {
  sitekey: string
  theme?: 'dark' | 'light'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: () => void
}

interface RecaptchaEnterprise {
  /** Queues a callback until the reCAPTCHA library is fully initialized. */
  ready: (callback: () => void) => void
  /** Renders a checkbox widget into the container and returns its widget id. */
  render: (container: HTMLElement, options: RecaptchaRenderOptions) => number
  /** Runs an invisible v3 check and resolves with the verification token. */
  execute: (siteKey: string, options: { action: string }) => Promise<string>
  reset: (widgetId?: number) => void
}

interface Window {
  grecaptcha?: {
    enterprise?: RecaptchaEnterprise
  }
}
