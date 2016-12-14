import {Auth} from './services/Auth';
import {AppRouter} from 'aurelia-router';
import {WakandaClient} from 'wakanda-client';
import {inject} from 'aurelia-framework';
import env from 'services/env';

const hostname = env.hostname;
const port = env.port;
const wakanda = new WakandaClient(`http://${hostname}:${port}`);

@inject(Auth, AppRouter)
export class Home {
    constructor(auth, router) {
        this.auth = auth;
        this.router = router;
    }

    logout() {
        wakanda.directory.logout().then(() => {
            this.auth.setCurrentUser().then(() => this.router.navigate('login'));
            console.log('logout.');
        }).catch(function (err) {
            this.auth.setCurrentUser();
            console.log('logout error.');
        });
    }
}
