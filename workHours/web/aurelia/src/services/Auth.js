import {WakandaClient} from 'wakanda-client';

const wakanda = new WakandaClient('http://127.0.0.1:8081');
// let authInstance = null;

export function Auth() {
    const self = this;

    // if (!authInstance) {
    //     authInstance = this;
    // }

    function reset() {
        self.user = {'fullName': 'Guest'};
        self.logged = false;
    }

    function getCurrentUser(resolveCb, refuseCb) {
        wakanda.directory.currentUser()
        .then(function (user) {
            console.log('user logged in.');
            self.user = user;
            self.logged = true;
            //debugger;
            resolveCb(user);
        }, function (err) {
            console.log('user not logged in.');
            reset();
            refuseCb(err.message);
        });
    }

    self.setCurrentUser = function () {
        self.promise = new Promise(getCurrentUser);
    };


    reset();
    self.setCurrentUser();
    //return authInstance;
}
