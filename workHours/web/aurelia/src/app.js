import {Auth} from './services/Auth';
import {Redirect} from 'aurelia-router';
import {setData} from './services/env';

export function App(auth) {
    this.primaryColor = '#ee6e73';
    this.accentColor = '#2bbbad';
    this.errorColor = '#f44336';
    this.configureRouter = (config, router) => {
        this.router = router;
        config.title = 'Work Times';
        config.addAuthorizeStep(AuthorizeStep);
        config.map([
            {route: '', redirect: 'home'},
            {route: 'home', title: 'Home', name: 'home', moduleId: './home', nav: true },
            {route: 'worktime', title: 'Worktime', name: 'worktime', moduleId: './worktime/worktimeSection', nav: true},
            {route: 'report', title: 'Report', name: 'report', moduleId: './report/report', nav: true},
            {route: 'debug', title: 'Debug', name: 'debug', moduleId: './debug/debug'},
            {route: 'login', title: 'Login', name: 'login', moduleId: './login/login'}
        ]);
    };
    this.auth = auth;

    this.activate = function () {
        return this.auth.setCurrentUser();
    };

    this.logout = function () {
        this.auth.logout().then(() => {
            this.router.navigate('login');
        });
    };
}

App.inject = [Auth];

function AuthorizeStep(auth, router) {
    this.auth = auth;
    this.run = (routingContext, next) => {
        return this.auth.setCurrentUser().then(() => {
            if (!this.auth.logged && routingContext.config.name !== 'login') {
                setData('routeRequest', routingContext.fragment); // Store the request for resume after login
                return next.cancel(new Redirect('login'));
            }
            return next();
        });
    };
}
AuthorizeStep.inject = [Auth];
