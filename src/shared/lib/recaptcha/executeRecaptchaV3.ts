import { RECAPTCHA_SITE_KEY } from '@/shared/config'

const SCRIPT_URL = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`

let scriptPromise: Promise<void> | null = null

const loadScript = (): Promise<void> => {
  if (scriptPromise) {
    return scriptPromise
  }

  scriptPromise = new Promise((resolve, reject) => {
    if (document.querySelector(`script[src^="${SCRIPT_URL}"]`)) {
      resolve()

      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_URL
    script.async = true
    script.defer = true

    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error('Failed to load reCAPTCHA script'))
    }

    document.head.appendChild(script)
  })

  return scriptPromise
}

export const executeRecaptchaV3 = async (action: string): Promise<string> => {
  await loadScript()

  const enterprise = window.grecaptcha?.enterprise
  if (!enterprise) {
    throw new Error('reCAPTCHA is not available')
  }

  await new Promise<void>((resolve) => enterprise.ready(resolve))

  return enterprise.execute(RECAPTCHA_SITE_KEY, { action })
}
