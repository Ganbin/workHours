import {WakandaClient} from 'wakanda-client';
import {AppRouter} from 'aurelia-router';
import {Auth} from 'services/Auth';
import {MdToastService} from 'aurelia-materialize-bridge';
import utils from 'services/utils';
import env from 'services/env';

const hostname = env.hostname;
const port = env.port;
const wakanda = new WakandaClient(`http://${hostname}:${port}`);
const PAGE_SIZE = '5';

export function Grid(auth, router, utilsService, toast) {
    const self = this;
    this.auth = auth;
    this.showFirstLast = true;
    this.router = router;
    this.route = 'worktime';
    this.utils = utilsService;
    this.toast = toast;
    this.startForm = 0;
    this.paginationPages = 0;
    this.pageSize = PAGE_SIZE;

    function editTime(ID) {
        this.router.navigate(this.route + '/' + ID);
    }
    function addWorkTime() {
        this.router.navigate(this.route + '/add');
    }
    this.editTime = editTime;
    this.addWorkTime = addWorkTime;

    wakanda.getCatalog(['WorkTime', 'Client', 'Category', 'CategoryUser', 'User']).then((ds) => {
        /**
         * Get all worktimes
         * @return no return but it affect the entities from the result to a worktime array
         */
        self.getAll = (start) => {
            return ds.WorkTime.getMine({
                pageSize: parseInt(this.pageSize, 10),
                start: start,
                orderBy: 'start desc'
            }).then((evt) => {
                self.worktimes = evt.times;
                self.paginationPages = Math.ceil(evt._count / this.pageSize);
            }).catch((err) => {
            });
        };

        self.pageChanged = (e) => {
            self.startFrom = this.pageSize * (e.detail - 1);
            self.getAll(self.startFrom);
        };

        self.pageSizeChanged = () => {
            self.getAll(0);
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
