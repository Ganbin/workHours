import {WakandaClient} from 'wakanda-client';
import {AppRouter} from 'aurelia-router';
import {Auth} from 'services/Auth';
import {MdToastService} from 'aurelia-materialize-bridge';
import utils from 'services/utils';
import env from 'services/env';

const hostname = env.hostname;
const wakanda = new WakandaClient(`http://${hostname}:8081`);
const PAGE_SIZE = 5;

export function Grid(auth, router, utils, toast) {
    const self = this;
    this.auth = auth;
    this.showFirstLast = true;
    this.router = router;
    this.route = 'worktime';
    this.utils = utils;
    this.toast = toast;
    this.startForm = 0;
    this.paginationPages = 0;

    function editTime(ID) {
        this.router.navigate(this.route + '/' + ID);
    }
    function addWorkTime() {
        this.router.navigate(this.route + '/add');
    }
    this.editTime = editTime;
    this.addWorkTime = addWorkTime;

    wakanda.getCatalog(['WorkTime', 'Client', 'Category', 'CategoryUser', 'User']).then((ds) => {
        console.log(directoryComponent);
        /**
         * Get all worktimes
         * @return no return but it affect the entities from the result to a worktime array
         */
        self.getAll = (start) => {
            return ds.WorkTime.query({
                filter: 'ID >= 0',
                pageSize: PAGE_SIZE,
                start: start,
                orderBy: 'start desc'
            }).then((evt) => {
                self.worktimes = evt;
                self.paginationPages = Math.ceil(evt._count / evt._pageSize);
                console.log(`${evt._count}<->${evt._pageSize}`);
            }).catch((err) => {
            });
        };

        self.pageChanged = (e) => {
            self.startFrom = PAGE_SIZE * (e.detail - 1);
            self.getAll(self.startFrom);
        };

        self.deleteTime = function (ID) {
            ds.WorkTime.find(ID).then((entity) => {
                entity.delete().then(() => {
                    self.toast.show('Time deleted!', 5000, 'green bold');
                    self.getAll(self.startFrom);
                }).catch((e) => {
                    self.toast.show('Time can\'t be deleted!', 5000, 'red bold');
                });
            }).catch((e) => {
                self.toast.show('Time not found!', 5000, 'red bold');
            });
        };
        self.getAll(0);
    });
}
Grid.inject = [Auth, AppRouter, utils, MdToastService];
