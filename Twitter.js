var _ = require('underscore');
var Twitter = require('twitter');

module.exports = function (twitterIntegrationProvider, integrationService, Q) {

    return {
        api: function () {
          var args = arguments;
          return integrationService.integrationsForAppId('twitter').then(function (integrations) {
            if (!integrations[0]) {
              throw new Error("There are no twitter integrations");
            }
            return new Twitter({
              consumer_key: twitterIntegrationProvider.twitterAppId,
              consumer_secret: twitterIntegrationProvider.twitterSecret,
              access_token_key: integrations[0].accessToken.split(':')[0],
              access_token_secret: integrations[0].accessToken.split(':')[1]
            });
          });
        },
        get: function (path, params) {
          return this.api().then(function (client) {
            return Q.nfbind(client.get.bind(client))(path, params);
          })
        },
        post: function (path, params) {
          return this.api().then(function (client) {
            return Q.nfbind(client.post.bind(client))(path, params);
          })
        },
        stream: function (url, opts, actionCallback) {
          return this.api().then(function (client) {
            client.stream(url, opts, function(stream) {
              stream.on('data', function(tweet) {
                Q(actionCallback(tweet)).catch(function (err) {
                  console.error(err); //TODO
                });
              });

              stream.on('error', function(error) {
                console.error(error); //TODO
              });
            });
          })
        }
    }
};
