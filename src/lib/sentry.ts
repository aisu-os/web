import * as Sentry from '@sentry/react'

const isProd = import.meta.env.PROD

if (isProd) {
  Sentry.init({
    dsn: 'https://aKcMCLeRtkZwMZxJZvnEnhFR@s1770632.eu-fsn-3.betterstackdata.com/1770632',
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

export { Sentry }
