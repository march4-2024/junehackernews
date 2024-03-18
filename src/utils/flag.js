import Rox from 'rox-browser'
import { betaAccess, isLoggedIn, getCompany } from './users'

export const Flags = {
  score: new Rox.Flag(false),
  ask: new Rox.Flag(false),
  show: new Rox.Flag(false),
  headerColor: new Rox.RoxString('is-dark', ['is-dark', 'is-primary', 'is-white']),
  headerWidth: new Rox.RoxNumber(50, [50, 100, 200]),
  boxColor: new Rox.RoxString('is-dark', ['is-dark', 'is-primary', 'is-white']),
  navFontSize: new Rox.RoxNumber(12, [12, 24, 48])
}

export const configurationFetchedHandler = fetcherResults => {
  if (fetcherResults.hasChanges && fetcherResults.fetcherStatus === 'APPLIED_FROM_NETWORK') {
    window.location.reload(false)
  }
}

export const impressionHandler = (reporting) => {
  if (reporting.targeting) {
    console.log('flag ' + reporting.name + ' value is ' + reporting.value)
  } else {
    console.log('No experiment configured for flag ' + reporting.name + '. default value ' + reporting.value + ' was used')
  }
}
//below is if you want to use prod
const API_HOST = `https://api.cloudbees.io`
//below is if you want to use staging
//const API_HOST = `https://api-staging.saas-dev.beescloud.com`

const options = {
  configurationFetchedHandler: configurationFetchedHandler,
  impressionHandler: impressionHandler,
  configuration: {
    API_HOST: API_HOST,
    CD_API_ENDPOINT: `${API_HOST}/device/get_configuration`,
    CD_S3_ENDPOINT: 'https://development-conf.rollout.io/',
    SS_API_ENDPOINT: `${API_HOST}/device/update_state_store/`,
    SS_S3_ENDPOINT: 'https://development-statestore.rollout.io/',
    CLIENT_DATA_CACHE_KEY: 'client_data',
    ANALYTICS_ENDPOINT: 'https://localhost:8787',
    NOTIFICATIONS_ENDPOINT: 'https://api-staging.saas-dev.beescloud.com/sse'
  },
  debugLevel: 'verbose',
  disableSignatureVerification: true
}

  Rox.setCustomBooleanProperty('isBetaUser', betaAccess())
Rox.setCustomBooleanProperty('isLoggedIn', isLoggedIn())
Rox.setCustomStringProperty('company', getCompany())

Rox.register('example', Flags)

Rox.setup('b25fdb44-e6b2-4742-63a3-7edb87c11612', options)
//above is lgTest in prod cloudbees.io subOrg1, subOrgA, using JS yarn
//below is older versions:
// staging, staging org, env is testEnv feb27 2024
// Rox.setup(process.env.VUE_APP_ROLLOUT_KEY, options)
