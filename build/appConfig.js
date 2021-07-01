// your account sid
var accountSid = 'AC1550fb94316aeeab4ea69c68927ba1e8';

// your runtime domain
var serviceBaseUrl = 'https://plugin-sms-new-7013.twil.io';

// set to /plugins.json for local dev
// set to /plugins.local.build.json for testing your build
// set to "" for the default live plugin loader
var pluginServiceUrl = '/plugins.json';

var appConfig = {
  serviceBaseUrl: serviceBaseUrl + '/',
  pluginService: {
    enabled: true,
    url: pluginServiceUrl,
  },
  sso: {
    accountSid: accountSid,
    tokenizerUrl: serviceBaseUrl + '/tokenizer',
  },
  ytica: false,
  logLevel: 'debug',
  showSupervisorDesktopView: true,
};
