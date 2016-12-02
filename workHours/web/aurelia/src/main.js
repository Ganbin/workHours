import environment from './environment';
//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
Promise.config({
    warnings: {
        wForgottenReturn: false
    }
});

export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .feature('resources')
        .plugin('aurelia-materialize-bridge', bridge => bridge.useAll() )
        .plugin('aurelia-validation');

    if (environment.debug) {
        aurelia.use.developmentLogging();
    }

    if (environment.testing) {
        aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(() => aurelia.setRoot());
}
