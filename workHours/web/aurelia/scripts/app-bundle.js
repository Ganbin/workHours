define('app',['exports', './services/Auth', 'aurelia-router'], function (exports, _Auth, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.App = App;
    function App(auth) {
        var _this = this;

        this.configureRouter = function (config, router) {
            _this.router = router;
            config.title = 'Work Times';
            config.addAuthorizeStep(AuthorizeStep);
            config.map([{ route: '', redirect: 'home' }, { route: 'home', title: 'Home', name: 'home', moduleId: './home', nav: true }, { route: 'worktime', title: 'Worktime', name: 'worktime', moduleId: './worktime/worktimeSection', nav: true }]);
        };
        this.auth = auth;
    }

    App.inject = [_Auth.Auth];

    function AuthorizeStep(auth, router) {
        var _this2 = this;

        this.auth = auth;

        this.run = function (routingContext, next) {
            if (!_this2.auth.logged && routingContext.config.name !== 'home') {
                return next.cancel(new _aureliaRouter.Redirect('home'));
            }
            return next();
        };
    }
    AuthorizeStep.inject = [_Auth.Auth];
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('home',['exports', './services/Auth', 'wakanda-client'], function (exports, _Auth, _wakandaClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Home = Home;


    var wakanda = new _wakandaClient.WakandaClient('http://127.0.0.1:8081');
    function Home(Auth) {
        this.login = function () {
            wakanda.directory.login('ganbin', '1234').then(function () {
                Auth.setCurrentUser();
                alert('login');
            }).catch(function (e) {
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
            wakanda.getCatalog().then(function (result) {});
        }

        doSomething();
    }
    Home.inject = [_Auth.Auth];
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }
    aurelia.use.plugin('aurelia-materialize-bridge', function (bridge) {
      return bridge.useAll();
    });

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('noViewPort',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NoViewPort = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var NoViewPort = exports.NoViewPort = (_dec = (0, _aureliaFramework.inlineView)('<template><span></span></template>'), _dec2 = (0, _aureliaFramework.inject)(Element), _dec(_class = _dec2(_class = function () {
    function NoViewPort(element) {
      _classCallCheck(this, NoViewPort);

      this.element = element;
    }

    NoViewPort.prototype.attached = function attached() {};

    NoViewPort.prototype.detached = function detached() {};

    return NoViewPort;
  }()) || _class) || _class);
});
define('resources/index',['exports'], function (exports) {
                        'use strict';

                        Object.defineProperty(exports, "__esModule", {
                                                value: true
                        });
                        exports.configure = configure;
                        function configure(config) {
                                                config.globalResources(['./elements/navBar', './elements/datePicker', './value-converters/millisToHours', './value-converters/minutesToHours', './value-converters/dateFormat', './value-converters/truncate']);
                        }
});
define('services/Auth',['exports', 'wakanda-client'], function (exports, _wakandaClient) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Auth = Auth;


    var wakanda = new _wakandaClient.WakandaClient('http://127.0.0.1:8081');
    function Auth() {
        var self = this;

        function reset() {
            self.user = { 'fullName': 'Guest' };
            self.logged = false;
        }

        function getCurrentUser(resolveCb, refuseCb) {
            wakanda.directory.currentUser().then(function (user) {
                console.log('user logged in.');
                self.user = user;
                self.logged = true;

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
    }
});
define('worktime/form',['exports', 'wakanda-client', 'aurelia-router'], function (exports, _wakandaClient, _aureliaRouter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Form = Form;


    var wakanda = new _wakandaClient.WakandaClient('http://127.0.0.1:8081');

    function Form(router) {
        var _this = this;

        this.router = router;
        this.activate = function (params) {
            _this.ID = params.id;
            wakanda.getCatalog().then(function (ds) {
                _this.getEntity = function (ID) {
                    ds.WorkTime.find(ID).then(function (worktime) {
                        _this.worktime = worktime;
                        console.log('test', worktime);
                    }).catch(function (err) {});
                };

                _this.getEntity(_this.ID);
            });
        };

        this.navigateBack = function () {
            _this.router.navigateBack();
        };
    }

    Form.inject = [_aureliaRouter.AppRouter];
});
define('worktime/grid',['exports', 'wakanda-client', 'aurelia-router', 'services/Auth'], function (exports, _wakandaClient, _aureliaRouter, _Auth) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Grid = Grid;

    var wakanda = new _wakandaClient.WakandaClient('http://127.0.0.1:8081');
    var PAGE_SIZE = 5;

    function Grid(auth, router) {
        var self = this;
        this.auth = auth;
        this.showFirstLast = true;
        this.router = router;
        this.route = 'worktime';


        function editTime(ID) {
            this.router.navigate(this.route + '/' + ID);
        }
        this.editTime = editTime;

        wakanda.getCatalog().then(function (ds) {
            self.getAll = function (start) {
                ds.WorkTime.query({
                    filter: 'ID >= 0',
                    pageSize: PAGE_SIZE,
                    start: start
                }).then(function (evt) {
                    self.worktimes = evt;
                }).catch(function (err) {});
            };

            self.pageChanged = function (e) {
                self.getAll(PAGE_SIZE * (e.detail - 1));
            };

            self.getAll(0);
        });
    }
    Grid.inject = [_Auth.Auth, _aureliaRouter.AppRouter];
});
define('worktime/worktimeSection',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var worktimeSection = exports.worktimeSection = function () {
        function worktimeSection() {
            _classCallCheck(this, worktimeSection);
        }

        worktimeSection.prototype.configureRouter = function configureRouter(config, router) {
            config.map([{ route: '', moduleId: './grid', nav: false, title: '' }, { route: ':id', moduleId: './form', nav: false, title: '' }]);
        };

        return worktimeSection;
    }();
});
define('resources/elements/datePicker',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.DatePickerCustomElement = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var DatePickerCustomElement = exports.DatePickerCustomElement = (0, _aureliaFramework.decorators)((0, _aureliaFramework.bindable)({ name: 'date', defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), (0, _aureliaFramework.bindable)({ name: 'ID', defaultBindingMode: _aureliaFramework.bindingMode.oneTime }), (0, _aureliaFramework.bindable)({ name: 'label', defaultBindingMode: _aureliaFramework.bindingMode.oneTime })).on(function () {
        function _class() {
            _classCallCheck(this, _class);
        }

        _class.prototype.attached = function attached() {
            $('.datepicker').pickadate({
                selectMonths: true,
                selectYears: 3 });
        };

        return _class;
    }());
});
define('resources/elements/navBar',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.NavBarCustomElement = NavBarCustomElement;
    function NavBarCustomElement() {
        var self = this;

        self.setActive = function (tab) {
            self.activeTab = tab;
        };
        self.isActive = function (tab) {
            if (tab === this.activeTab) {
                return true;
            }
            return false;
        };
    }
});
define('resources/elements/pagination',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.PaginationCustomElement = PaginationCustomElement;
    function PaginationCustomElement() {
        var self = this;

        self.activePage = 1;
        self.overallPageLinks = 200;
        self.showFirstLast = true;
        self.showPrevNext = true;
        self.showPageLinks = true;
        self.visiblePageLinks = '16';

        self.setActive = function (tab) {
            self.activeTab = tab;
        };
    }
});
define('resources/value-converters/dateFormat',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value, format) {
      return (0, _moment2.default)(value).format(format);
    };

    return DateFormatValueConverter;
  }();
});
define('resources/value-converters/millisToHours',['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var MillisToHoursValueConverter = exports.MillisToHoursValueConverter = function () {
        function MillisToHoursValueConverter() {
            _classCallCheck(this, MillisToHoursValueConverter);
        }

        MillisToHoursValueConverter.prototype.toView = function toView(millis) {
            if (millis === undefined) {
                return '0';
            }
            var date = void 0;
            var minutes = millis / 1000 / 60;
            date = (Math.floor(millis / 60) < 10 ? '0' + Math.floor(minutes / 60) : Math.floor(minutes / 60)) + ':' + (minutes % 60 < 10 ? '0' + minutes % 60 : minutes % 60);
            return date;
        };

        return MillisToHoursValueConverter;
    }();
});
define('resources/value-converters/minutesToHours',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var MinutesToHoursValueConverter = exports.MinutesToHoursValueConverter = function () {
        function MinutesToHoursValueConverter() {
            _classCallCheck(this, MinutesToHoursValueConverter);
        }

        MinutesToHoursValueConverter.prototype.toView = function toView(minutes) {
            var date = (Math.floor(minutes / 60) < 10 ? "0" + Math.floor(minutes / 60) : Math.floor(minutes / 60)) + ':' + (minutes % 60 < 10 ? "0" + minutes % 60 : minutes % 60);
            return date;
        };

        return MinutesToHoursValueConverter;
    }();
});
define('resources/value-converters/truncate',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var TruncateValueConverter = exports.TruncateValueConverter = function () {
        function TruncateValueConverter() {
            _classCallCheck(this, TruncateValueConverter);
        }

        TruncateValueConverter.prototype.toView = function toView(text, length, end) {
            if (text !== undefined && text !== null) {
                if (isNaN(length)) {
                    length = 10;
                }
                end = end || "...";
                if (text.length <= length || text.length - end.length <= length) {
                    return text;
                } else {
                    return String(text).substring(0, length - end.length) + end;
                }
            }
        };

        return TruncateValueConverter;
    }();
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"materialize-css/css/materialize.css\"></require>\n  <nav>\n    <div class=\"nav-wrapper\">\n      <a href=\"#\" class=\"brand-logo waves-effect waves-light\">&nbsp;${router.title} - Welcome ${auth.user.fullName}</a>\n      <a href=\"#\" data-activates=\"mobile-demo\" class=\"button-collapse\" materialize=\"sidenav\"><i class=\"mdi-navigation-menu\"></i></a>\n      <ul class=\"right hide-on-med-and-down\">\n        <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\n          <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\n        </li>\n      </ul>\n      <ul class=\"side-nav\">\n        <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\n          <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\n        </li>\n      </ul>\n    </div>\n  </nav>\n\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n\n</template>\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\nWelcome ${auth.user.fullName}\n<md-pagination md-pages=\"6\" md-active-page.bind=\"currentPage\"></md-pagination>\n\n<div class=\"button-row\">\n    <button md-waves md-button click.delegate=\"login()\">Login</button>\n    <button md-button=\"flat: true;\" class=\"waves-effect\" click.delegate=\"logout()\">Logout</button>\n  </div>\n  <div class=\"button-row\">\n    <button md-waves md-button=\"large: true;\">I'm a large button</button>\n    <button md-button=\"flat: true; large: true;\">I'm a large flat button</button>\n  </div>\n  <div class=\"button-row\">\n    <button md-button=\"disabled: true;\">I'm a basic disabled button</button>\n    <button md-button=\"disabled: true; flat: true;\">I'm a flat disabled button</button>\n  </div>\n</template>\n"; });
define('text!worktime/form.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"container m-t-20\">\n    <a class=\"btn-floating btn-large waves-effect waves-light\" click.delegate=\"navigateBack()\"><i class=\"material-icons\">navigate_before</i></a>\n    <h2 class=\"header\">Test</h2>\n    <div>\n    <md-card md-title=\"Password input\">\n      <div>\n        <!-- <md-input md-type=\"password\" md-label=\"password text field\" md-value.bind=\"password\"></md-input> -->\n        <md-input md-type=\"email\" md-label=\"email\" md-validate=\"true\" md-validate-error=\"invalid email\" md-value.bind=\"email\"></md-input>\n      </div>\n    </md-card>\n    <md-card md-title=\"Time\">\n      <div>\n        <date-picker ID=\"startDate\" label=\"Start Date\" date.bind=\"worktime.start\"></date-picker>\n      </div>\n    </md-card>\n    <md-card md-title=\"Details\">\n      <div>\n        <!-- <md-input md-type=\"number\" md-step=\"any\" md-label=\"float number text field\" md-validate=\"true\" md-validate-error=\"invalid number\" md-value.bind=\"floatingNumber\"></md-input><br /> -->\n      </div>\n    </md-card>\n    <md-card md-title=\"Extra\">\n      <div>\n        <!-- <md-input md-type=\"number\" md-step=\"2\" md-label=\"number text field\" md-validate=\"true\" md-validate-error=\"invalid number\" md-value.bind=\"number\"></md-input><br /> -->\n      </div>\n    </md-card>\n  </div>\n  </div>\n</template>\n"; });
define('text!worktime/grid.html', ['module'], function(module) { module.exports = "<template><!-- Display a list of the worktime -->\n\t<div class=\"m-t-20\">\n\t\t<div class=\"\">\n\t  \t<button type='button' title=\"Add a Work Time\" ng-click=\"gridCtrl.addWorkTime()\" class=\"btn btn-primary no-print\">ADD</button>\n\t\t\t<h4>Temps de travail de ${userName} pour ${clientName}<span ng-show=\"gridCtrl.showDates\"> du ${from | dateFormat : 'DD.MM.YYYY'} au ${to | dateFormat : 'DD.MM.YYYY'}</span></h4>\n\t\t\t<span>test : ${worktimes._count}- ${worktimes._pageSize}- ${worktimes._sent}</span>\n\t  </div>\n\t\t<div class=\"\">\n\t\t\t<div class=\"table-responsive-vertical shadow-z-1\">\n  <!-- Table starts here -->\n  \t\t\t<table id=\"table\" class=\"table table-hover table-mc-light-blue\">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th>Start</th>\n\t\t\t\t\t\t\t<th>End</th>\n\t\t\t\t\t\t\t<th class=\"truncateCstm\">Duration</th>\n\t\t\t\t\t\t\t<th class=\"comment\" width=\"\">Comment</th>\n\t\t\t\t\t\t\t<th class=\"hide-on-med-and-down truncateCstm\">Break</th>\n\t\t\t\t\t\t\t<th class=\"hide-on-med-and-down truncateCstm\">Reason</th>\n\t\t\t\t\t\t\t<th class=\"hide-on-med-and-down truncateCstm\">Client</th>\n\t\t\t\t\t\t\t<th class=\"truncateCstm\">Category</th>\n\t\t\t\t\t\t\t<th class=\"truncateCstm\">User</th>\n\t\t\t\t\t\t\t<th class=\"no-print\"></th>\n\t\t\t\t\t\t\t<th class=\"no-print\"></th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody>\n\t\t\t\t\t\t<tr class=\"clickable\" repeat.for=\"worktime of worktimes.entities\">\n\t\t\t\t\t\t\t<td data-title=\"Start\">${worktime.start | dateFormat:'DD.MM.YY HH:mm'}</td>\n\t\t\t\t\t\t\t<td data-title=\"End\">${worktime.end | dateFormat:'DD.MM.YY HH:mm'}</td>\n\t\t\t\t\t\t\t<td data-title=\"Duration\">${worktime.timeWorked | millisToHours}</td>\n\t\t\t\t\t\t\t<td data-title=\"Comment\" class=\"w-b comment\">${worktime.comment}</td>\n\t\t\t\t\t\t\t<td data-title=\"Break\" class=\"hide-on-med-and-down\">${gridCtrl.millisToUTCDate(worktime.break) | dateFormat:'HH:mm'}</td>\n\t\t\t\t\t\t\t<td data-title=\"Reason\" class=\"hide-on-med-and-down truncateCstm\">${worktime.breakReason | truncate:25}</td>\n\t\t\t\t\t\t\t<td data-title=\"Client\" class=\"hide-on-med-and-down truncateCstm\">${worktime.clientName}</td>\n\t\t\t\t\t\t\t<td data-title=\"Category\" class=\"truncatseCstm\">${worktime.categoryName}</td>\n\t\t\t\t\t\t\t<td data-title=\"User\" class=\"truncateCstm\">${worktime.userName}</td>\n\t\t\t\t\t\t\t<td data-title=\"\" click.delegate=\"editTime(worktime.ID)\" class=\"no-print center-align\"><span title=\"Edit\" class=\"material-icons \">edit</span></td>\n\t\t\t\t\t\t\t<td data-title=\"\" class=\"no-print center-align\"><span title=\"Delete\" class=\"material-icons\">delete</span></td>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t<button class=\"full-width waves-effect btn no-print\" click.delegate=\"worktimes.more()\" show.bind=\"worktimes._sent < worktimes._count\"><span class=\"material-icons\">add</span></button>\n\n\t\t\t<md-pagination class=\"center-align\" md-show-first-last=\"0\" md-show-prev-next=\"0\" md-on-page-changed.delegate=\"pageChanged($event)\" md-pages.bind=\"worktimes._count / worktimes._pageSize\" md-visible-page-links=\"6\">\n\t\t\t</md-pagination>\n\n\t\t\t<!-- <md-switch md-checked.bind=\"showFirstLast\"></md-switch>\n\t\t\t<md-pagination class=\"center-align\" md-show-first-last.two-way=\"showFirstLast\" md-show-first-last=\"0\" md-pages=\"5\" md-visible-page-links=\"3\" md-active-page=\"1\"></md-pagination>\n\t\t</div>\n\t\t<div class=\"container\">\n\t\t\t<div class=\"progress\">\n\t\t\t\t<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{gridCtrl.collValueNow}}\" aria-valuemin=\"0\" aria-valuemax=\"{{gridCtrl.collValueMax}}\" style=\"width: {{gridCtrl.collValuePercent}}%;\">\n\t\t\t\t\t <span>60% Complete</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div> -->\n\t</div>\n</template>\n"; });
define('text!worktime/worktimeSection.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!resources/elements/datePicker.html', ['module'], function(module) { module.exports = "<template>\n  <label for.bind=\"ID\">${label}</label>\n  <input id.bind=\"ID\" type=\"date\" class=\"datepicker\" value.bind=\"date | dateFormat: 'YYYY-MM-DD'\" />\n</template>\n"; });
define('text!resources/elements/navBar.html', ['module'], function(module) { module.exports = "<template>\n  <header class=\"container full-width no-padding\">\n    <nav class=\"navbar navbar-default\">\n      <div class=\"container-fluid\">\n\n      \t<div class=\"navbar-header\">\n\n      \t\t<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\".collapse\" aria-expanded=\"\">\n      \t\t\t<span class=\"sr-only\">Toggle navigation</span>\n      \t\t\t<span class=\"icon-bar\"></span>\n      \t\t\t<span class=\"icon-bar\"></span>\n      \t\t\t<span class=\"icon-bar\"></span>\n      \t\t</button>\n      \t\t<a id=\"titleTxt\" class=\"navbar-brand\" href=\"#\">Worktime</a>\n      \t</div>\n      \t<div class=\"navbar-collapse collapse\">\n      \t\t<div ng-controller=\"tabs as tabCtrl\">\n      \t\t\t<ul class=\"nav navbar-nav\">\n      \t\t\t\t<li><a route-href=\"route: home\">Home<span class=\"sr-only\">(current)</span></a></li>\n      \t\t\t\t<li><a route-href=\"route: worktime\">WorkTime</a></li>\n      \t\t\t\t<li><a>Clients</a></li>\n      \t\t\t\t<li ng-class=\"{'active':tabCtrl.isActive('category')}\" ng-click=\"tabCtrl.setActive('category')\"><a ui-sref=\"app.categories\">Categories</a></li>\n      \t\t\t\t<li ng-class=\"{'active':tabCtrl.isActive('report')}\" ng-click=\"tabCtrl.setActive('report')\"><a ui-sref=\"app.report\">Report</a></li>\n      \t\t\t</ul>\n      \t\t</div>\n      \t\t<login></login>\n      \t</div>\n      </div><!-- /.container-fluid -->\n    </nav>\n  </header>\n</template>\n"; });
define('text!resources/elements/pagination.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"pagination\">\n    <li class=\"disabled\"><a href=\"#!\"><i class=\"material-icons\">chevron_left</i></a></li>\n    <li class=\"active\"><a href=\"#!\">1</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">2</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">3</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">4</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">5</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\"><i class=\"material-icons\">chevron_right</i></a></li>\n  </ul>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map