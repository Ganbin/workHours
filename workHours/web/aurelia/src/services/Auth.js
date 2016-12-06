import {WakandaClient} from 'wakanda-client';
import env from 'services/env';
const hostname = env.hostname;
const wakanda = new WakandaClient(`http://${hostname}:8081`);

export function Auth() {
    const self = this;
    self.isAdmin = false;

    function reset() {
        self.user = {'fullName': 'Guest'};
        self.logged = false;
        self.isAdmin = false;
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

    self.isDataAdmin = function () {
        return wakanda.directory.currentUserBelongsTo('DataAdmin').then(function (result) {
            self.isAdmin = result;
        });
    };

    reset();
    self.isDataAdmin();
}
