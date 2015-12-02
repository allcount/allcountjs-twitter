exports.installModule = function (injection) {
    injection.bindMultiple('integrationProviders', ['twitterIntegrationProvider']);
    injection.bindMultiple('compileServices', ['twitterIntegrationProvider']);
    injection.bindFactory('twitterIntegrationProvider', require('./twitter-integration-provider'));
    injection.bindMultiple('appConfigurators', ['twitterOauthRoute']);
    injection.bindFactory('twitterOauthRoute', require('./oauth-route'));
    injection.bindFactory('Twitter', require('./Twitter'));
};
