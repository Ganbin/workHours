import {WakandaClient} from 'wakanda-client';
import {AppRouter} from 'aurelia-router';
import {Auth} from 'services/Auth';
import {MdToastService} from 'aurelia-materialize-bridge';
import utils from 'services/utils';
import env from 'services/env';
import moment from 'moment';

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
  this.startFrom = 0;
  this.paginationPages = 0;
  this.activePage = 1;
  this.pageSize = PAGE_SIZE;
  this.from;
  this.to;
  this.clientName = 'all';
  this.userID = '';
  this.message = '';
  this.all = false;
  this.filtered = false;

  function editTime(ID) {
    this.router.navigate(this.route + '/' + ID);
  }
  function addWorkTime() {
    this.router.navigate(this.route + '/add');
  }
  function removeFilter() {
    this.filtered = !this.filtered;
    localStorage.removeItem('filter');
    self.getAll(0, self.all);
  }
  this.editTime = editTime;
  this.addWorkTime = addWorkTime;
  this.removeFilter = removeFilter;


  wakanda.getCatalog(['WorkTime', 'Client', 'Category', 'CategoryUser', 'User']).then((ds) => {
    /**
    * Get all worktimes
    * @return no return but it affect the entities from the result to a worktime array
    */
    self.getAll = (start, all) => {
      let options = {};
      all = all || false;
      self.all = all;
      if (all) {
        options.all = all;
      } else {
        options.pageSize = parseInt(self.pageSize, 10);
        options.start = start;
      }

      return ds.WorkTime.getMine(options).then((evt) => {
        self.worktimes = evt.times;
        if (!self.all) {
          self.paginationPages = Math.ceil(evt._count / self.pageSize);
          localStorage.setItem('paginationPages', `${self.paginationPages}`);
        }
      }).catch((err) => {
      });
    };

    self.getFiltered = function (start, all) {
      let options = {};
      self.filtered = true;
      all = all || false;
      self.all = all;

      if (all) {
        options.all = all;
      } else {
        options.pageSize = parseInt(self.pageSize, 10);
        options.start = start;
      }

      options.from = self.from;
      options.to = self.to;
      options.clientName = self.clientName;
      options.userID = self.userID;

      localStorage.setItem('filter', JSON.stringify(options));

      ds.WorkTime.getFiltered(options).then((evt) => {
        self.worktimes = evt.times;
        if (!self.all) {
          self.paginationPages = Math.ceil(evt._count / self.pageSize);
          localStorage.setItem('paginationPages', `${self.paginationPages}`);
        }
      });
    };

    self.pageChanged = (e) => {
      const all = self.pageSize === 'all';
      self.startFrom = 0;
      if (!all) {
        self.startFrom = self.pageSize * (e.detail - 1);
        localStorage.setItem('startFrom', `${self.startFrom}`);
        localStorage.setItem('activePage', `${e.detail}`);
      }
      if (self.filtered) {
        self.getFiltered(self.startFrom, all);
      } else {
        self.getAll(self.startFrom, all);
      }
    };

    self.pageSizeChanged = () => {
      const all = self.pageSize === 'all';
      localStorage.setItem('pageSize', `${self.pageSize}`);
      if (self.filtered) {
        self.getFiltered(0, all);
      } else {
        self.getAll(0, all);
      }
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

    self.applyFilter = function ($event) {
      // Here we gonna get the submit event from the filter custom element
      const userName = $event.detail.userName;
      const all = self.pageSize === 'all';
      self.message = `Work times of ${userName} for ${self.clientName === 'all' ? 'all clients' : self.clientName} from ${moment(self.from).format('DD.MM.YYYY')} to ${moment(self.to).format('DD.MM.YYYY')}`;

      self.getFiltered(self.startFrom, all);
    };

    // Get back the state if one is find in the localStorage
    if (localStorage.getItem('activePage') != null) {
      self.activePage = parseInt(localStorage.getItem('activePage'), 10);
    }
    if (localStorage.getItem('paginationPages') != null) {
      const paginationPages = localStorage.getItem('paginationPages');

      self.paginationPages = parseInt(paginationPages, 10);
    }
    if (localStorage.getItem('startFrom') != null) {
      const startFrom = localStorage.getItem('startFrom');
      self.startFrom = parseInt(startFrom, 10);
    }
    if (localStorage.getItem('pageSize') != null) {
      const pageSize = localStorage.getItem('pageSize');
      self.pageSize = pageSize;
      if (pageSize === 'all') {
        self.all = true;
      }
    }
    if (localStorage.getItem('filter') != null) {
      const filter = JSON.parse(localStorage.getItem('filter'));
      self.filtered = true;
      self.from = new Date(filter.from);
      self.to = new Date(filter.to);
      self.clientName = filter.clientName;
      self.userID = filter.userID;
      self.getFiltered(self.startFrom, self.all);
    } else {
      self.getAll(self.startFrom, self.all);
    }
  });
}
Grid.inject = [Auth, AppRouter, utils, MdToastService];
