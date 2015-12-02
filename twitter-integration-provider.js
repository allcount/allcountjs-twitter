module.exports = function () {
    return {
        appId: 'twitter',
        appName: 'Twitter',
        accessTokenUrl: function () {
            return '/oauth/twitter';
        },
        compile: function (objects) {
            var self = this;
            objects.forEach(function (obj) {
              obj.invokePropertiesOn({
                twitterAppId: function (appId) {
                  self.twitterAppId = appId;
                },
                twitterSecret: function (secret) {
                  self.twitterSecret = secret;
                }
              });
            });
        }
    }
};
