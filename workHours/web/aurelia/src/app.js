import {Auth} from './services/Auth';
import {Redirect} from 'aurelia-router';

export function App(auth) {
    this.configureRouter = (config, router) => {
        this.router = router;
        config.title = 'Work Times';
        config.addAuthorizeStep(AuthorizeStep);
        config.map([
            {route: '', redirect: 'home'},
            {route: 'home', title: 'Home', name: 'home', moduleId: './home', nav: true },
            {route: 'worktime', title: 'Worktime', name: 'worktime', moduleId: './worktime/worktimeSection', nav: true}
        ]);
    };
    this.auth = auth;
}

App.inject = [Auth];

function AuthorizeStep(auth, router) {
    this.auth = auth;

    this.run = (routingContext, next) => {
        if (!this.auth.logged && routingContext.config.name !== 'home') {
            return next.cancel(new Redirect('home'));
        }
        return next();
    };
}
AuthorizeStep.inject = [Auth];
