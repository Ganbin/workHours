import {WakandaClient} from 'wakanda-client';
import {AppRouter} from 'aurelia-router';
import {inject, observable, NewInstance} from 'aurelia-framework';
// import {ValidationRules, ValidationController} from 'aurelia-validation';
import { /*MaterializeFormValidationRenderer,*/ MdToastService } from 'aurelia-materialize-bridge';
import {Auth} from 'services/Auth';
import env, {datas} from 'services/env';

const hostname = env.hostname;
const port = env.port;
const wakanda = new WakandaClient(`http://${hostname}:${port}`);

@inject(AppRouter, Auth, datas, MdToastService)
export class Login {
    userLogin='';
    password=''
    submitText='Login';

    constructor(router, auth, envDatas, toast) {
        this.router = router;
        this.auth = auth;
        this.datas = envDatas;
        this.toast = toast;
    }

    tryLogin() {
        wakanda.directory.login(this.userLogin, this.password).then(() => {
            //User is logged in
            this.auth.setCurrentUser().then((evt) => {
                this.auth.isDataAdmin().then(() => this.router.navigate(this.datas.routeRequest));
            }); // Resume the initial request after the user is logged in
        }).catch((e) => {
            //Login failed. Maybe bad credentials?
            this.auth.setCurrentUser().then((evt) => {
                this.toast.show('Wrong informations', 5000, 'rounded bold red');
            });
        });
    }

    logout() {
        this.auth.logout().then(() => {
            this.toast.show('You are now logged out', 7000);
        });
    }
}
