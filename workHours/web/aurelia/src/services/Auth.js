import {WakandaClient} from 'wakanda-client';
import env from 'services/env';
const hostname = env.hostname;
const wakanda = new WakandaClient(`http://${hostname}:8081`);

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
            self.user = user;
            self.logged = true;
            resolveCb({result: true, value: user});
        }, function (err) {
            reset();
            resolveCb({result: false, message: err.message});
        });
    }

    self.setCurrentUser = function () {
        return new Promise(getCurrentUser);
    };

    self.logout = function () {
        return wakanda.directory.logout().then(() => {
            reset();
        }).catch((err) => {
            reset();
        });
    };

    reset();

//    setInterval(() => new Promise(getCurrentUser), (1000 * 60)); // Do this will restart thje time of the session
//    Have to find a way to know that the user is not logged in anymore. Maybe in the activate method of the different route...
    //self.setCurrentUser();
    //return authInstance;
}
