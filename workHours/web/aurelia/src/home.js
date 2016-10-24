import {Auth} from './services/Auth';
// import {inject} from 'aurelia-framework';
import {WakandaClient} from 'wakanda-client';

const wakanda = new WakandaClient('http://127.0.0.1:8081');
// @inject(Auth)
// export class Home{
//     currentPage
//     constructor(Auth){
//         var self = this;
//         debugger;
//         self.user = Auth.promise.then(function(result){
            // if(result !== false){
            //     self.user = result;
            // }
//         });
//     }
// }

export function Home(Auth) {
    this.login = function () {
        wakanda.directory.login('ganbin', '1234').then(function () {
            //User is logged in
            Auth.setCurrentUser();
            alert('login');
        }).catch(function (e) {
            //Login failed. Maybe bad credentials?
            Auth.setCurrentUser();
            alert('not login');
        });
    };

    this.logout = function () {
        wakanda.directory.logout().then(function () {
            Auth.setCurrentUser();
            console.log('logout.');
        }).catch(function (err) {
            Auth.setCurrentUser();
            console.log('logout error.');
        });
    };

    function doSomething() {
        wakanda.getCatalog().then(function (result) {
                //debugger;
        });
    }

    doSomething();
}
Home.inject = [Auth];
