module.exports = function (appAccessRouter, integrationService, twitterIntegrationProvider, baseUrlService, Q) {
    var route = {};

    route.configure = function () {
        var params = function (req) {
            return {
                redirect_uri: baseUrlService.getBaseUrl() + '/oauth/twitter/callback?integrationId=' + req.query.integrationId
            };
        };

        function getOauth(req) {
          var OAuth= require('oauth').OAuth;
          return new OAuth(
            'https://api.twitter.com/oauth/request_token',
            'https://api.twitter.com/oauth/access_token',
            twitterIntegrationProvider.twitterAppId,
            twitterIntegrationProvider.twitterSecret,
            '1.0A',
            params(req).redirect_uri,
            'HMAC-SHA1'
          );
        }

        var tempSecret; //TODO ugly hack

        appAccessRouter.get('/oauth/twitter', function(req, res) {
          var oAuth = getOauth(req);
          oAuth.getOAuthRequestToken(function (error, oAuthToken, oAuthTokenSecret, results) {
            tempSecret = oAuthTokenSecret;
            var authURL = 'https://api.twitter.com/oauth/authenticate?oauth_token=' + oAuthToken;
            res.redirect(authURL);
          })
        });

        appAccessRouter.get('/oauth/twitter/callback', function(req, res, next) {
          var oAuth = getOauth(req);
          var getAccessToken = Q.nfbind(oAuth.getOAuthAccessToken.bind(oAuth));

          getAccessToken(req.query.oauth_token, tempSecret, req.query.oauth_verifier).then(function(results) {
              var access_token = results[0];
              var secret = results[1];
              return integrationService.updateIntegrationAccessToken(req.query.integrationId, access_token + ':' + secret).then(function () {
                  return res.redirect('/entity/Integration');
              });
          }).catch(next);
        });
    };

    return route;
};
