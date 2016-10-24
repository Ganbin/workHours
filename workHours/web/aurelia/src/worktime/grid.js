import {WakandaClient} from 'wakanda-client';
import {AppRouter} from 'aurelia-router';
import {Auth} from 'services/Auth';
import utils from 'services/utils';
const wakanda = new WakandaClient('http://127.0.0.1:8081');
const PAGE_SIZE = 5;

export function Grid(auth, router, utils) {
    const self = this;
    this.auth = auth;
    this.showFirstLast = true;
    this.router = router;
    this.route = 'worktime';
    this.utils = utils;

    function editTime(ID) {
        this.router.navigate(this.route + '/' + ID);
    }
    this.editTime = editTime;

    wakanda.getCatalog().then((ds) => {
        /**
         * Get all worktimes
         * @return no return but it affect the entities from the result to a worktime array
         */
        self.getAll = (start) => {
            ds.WorkTime.query({
                filter: 'ID >= 0',
                pageSize: PAGE_SIZE,
                start: start,
                orderBy: 'start desc'
            }).then((evt) => {
                self.worktimes = evt;
            }).catch((err) => {
            });
        };

        self.pageChanged = (e) => {
            self.getAll(PAGE_SIZE * (e.detail - 1));
        };

        self.getAll(0);
    });
  //
  //   var getAll = function(options) {
  //       ds.WorkTime.query(options).then(function(evt) {
  //         self.workTimes = evt.entities;
  //         //self.collValueNow = evt.result.length;
  //         //self.collValueMax = evt.result.$totalCount;
  //         //self.collValuePercent = Math.round((self.collValueNow / self.collValueMax) * 100);
  //
  //         //sharedData.setData('workTimes', self.workTimes);
  //         //self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
  //       }, function(err) {
  //         //sharedData.prepForBroadcast('logout');
  //       });
  //     },
  //
  //     getMore = function() {
  //       self.workTimes.more().then(function(evt) {
  //         //self.collValueNow = evt.result.length;
  //         //self.collValueMax = evt.result.$totalCount;
  //         //self.collValuePercent = Math.round((self.collValueNow / self.collValueMax) * 100);
  //         //self.canGetMore = (self.workTimes.length < self.workTimes.$totalCount) ? true : false;
  //       }, function(err) {
  //         //sharedData.prepForBroadcast('logout');
  //       });
  //     },
  //
  //     editTime = function(ID) {
  //       /*self.goToState('app.form.edit', {
  //         ID: ID
  //       });
  //       self.formLoaded = true;*/
  //     },
  //
  //     removeTime = function(evt) {
  //       /*alertify.confirm("Do you want to delete this item?", function() {
  //         sharedData.prepForBroadcast({
  //           "action": "removeTime",
  //           "entity": evt.workTime
  //         });
  //       }, function() {
  //         // user clicked "cancel"
  //       });*/
  //     },
  //
  //     addWorkTime = function() {
  //       /*self.goToState('app.form.add');
  //       self.formLoaded = true;*/
  //     };
  //
  //   self.getAll = getAll;
  //   self.getMore = getMore;
  //   self.editTime = editTime;
  //   self.removeTime = removeTime;
  //   self.addWorkTime = addWorkTime;
  //
  //   getAll({filter:"ID>0"});
  // });
}
Grid.inject = [Auth, AppRouter, utils];
