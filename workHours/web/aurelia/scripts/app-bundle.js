define('app',['exports', './services/Auth', 'aurelia-router', './services/env'], function (exports, _Auth, _aureliaRouter, _env) {
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
            config.map([{ route: '', redirect: 'home' }, { route: 'home', title: 'Home', name: 'home', moduleId: './home', nav: true }, { route: 'worktime', title: 'Worktime', name: 'worktime', moduleId: './worktime/worktimeSection', nav: true }, { route: 'debug', title: 'Debug', name: 'debug', moduleId: './debug/debug' }, { route: 'login', title: 'Login', name: 'login', moduleId: './login/login' }]);
        };
        this.auth = auth;

        this.activate = function () {
            return this.auth.setCurrentUser();
        };

        this.logout = function () {
            var _this2 = this;

            this.auth.logout().then(function () {
                _this2.router.navigate('login');
            });
        };
    }

    App.inject = [_Auth.Auth];

    function AuthorizeStep(auth, router) {
        var _this3 = this;

        this.auth = auth;
        this.run = function (routingContext, next) {
            return _this3.auth.setCurrentUser().then(function () {
                if (!_this3.auth.logged && routingContext.config.name !== 'login') {
                    (0, _env.setData)('routeRequest', routingContext.fragment);
                    return next.cancel(new _aureliaRouter.Redirect('login'));
                }
                return next();
            });
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
define('home',['exports', './services/Auth', 'aurelia-router', 'wakanda-client', 'aurelia-framework', 'services/env'], function (exports, _Auth, _aureliaRouter, _wakandaClient, _aureliaFramework, _env) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Home = undefined;

    var _env2 = _interopRequireDefault(_env);

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

    var _dec, _class;

    var hostname = _env2.default.hostname;
    var wakanda = new _wakandaClient.WakandaClient('http://' + hostname + ':8081');

    var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_Auth.Auth, _aureliaRouter.AppRouter), _dec(_class = function () {
        function Home(auth, router) {
            _classCallCheck(this, Home);

            this.auth = auth;
            this.router = router;
        }

        Home.prototype.logout = function logout() {
            var _this = this;

            wakanda.directory.logout().then(function () {
                _this.auth.setCurrentUser().then(function () {
                    return _this.router.navigate('login');
                });
                console.log('logout.');
            }).catch(function (err) {
                this.auth.setCurrentUser();
                console.log('logout error.');
            });
        };

        return Home;
    }()) || _class);
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
        aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-materialize-bridge', function (bridge) {
            return bridge.useAll();
        }).plugin('aurelia-validation');

        if (_environment2.default.debug) {
            aurelia.use.developmentLogging();
        }

        if (_environment2.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }

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
define('debug/debug',['exports', 'aurelia-framework', 'aurelia-validation', 'aurelia-materialize-bridge'], function (exports, _aureliaFramework, _aureliaValidation, _aureliaMaterializeBridge) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Debug = undefined;

    var _aureliaMaterializeBridge2 = _interopRequireDefault(_aureliaMaterializeBridge);

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

    var _dec, _class;

    var Debug = exports.Debug = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
        function Debug(controller) {
            _classCallCheck(this, Debug);

            this.controller = null;

            this.controller = controller;
        }

        Debug.prototype.validate = function validate() {
            this.controller.validate().then(function (v) {
                debugger;
            });
        };

        return Debug;
    }()) || _class);


    _aureliaValidation.ValidationRules.ensure('email').email().required().on(Debug);
});
define('login/login',['exports', 'wakanda-client', 'aurelia-router', 'aurelia-materialize-bridge', 'services/Auth', 'services/env'], function (exports, _wakandaClient, _aureliaRouter, _aureliaMaterializeBridge, _Auth, _env) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Login = undefined;

    var _env2 = _interopRequireDefault(_env);

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

    var _dec, _class;

    var hostname = _env2.default.hostname;
    var wakanda = new _wakandaClient.WakandaClient('http://' + hostname + ':8081');

    var Login = exports.Login = (_dec = inject(_aureliaRouter.AppRouter, _Auth.Auth, _env.datas, _aureliaMaterializeBridge.MdToastService), _dec(_class = function () {
        function Login(router, auth, envDatas, toast) {
            _classCallCheck(this, Login);

            this.userLogin = '';
            this.password = '';
            this.submitText = 'Login';

            this.router = router;
            this.auth = auth;
            this.datas = envDatas;
            this.toast = toast;
        }

        Login.prototype.tryLogin = function tryLogin() {
            var _this = this;

            wakanda.directory.login(this.userLogin, this.password).then(function () {
                _this.auth.setCurrentUser().then(function (evt) {
                    return _this.router.navigate(_this.datas.routeRequest);
                });
            }).catch(function (e) {
                _this.auth.setCurrentUser().then(function (evt) {
                    _this.toast.show('Wrong informations', 5000, 'rounded bold red');
                });
            });
        };

        Login.prototype.logout = function logout() {
            var _this2 = this;

            this.auth.logout().then(function () {
                _this2.toast.show('You are now logged out', 7000);
            });
        };

        return Login;
    }()) || _class);
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
define('services/Auth',['exports', 'wakanda-client', 'services/env'], function (exports, _wakandaClient, _env) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Auth = Auth;

    var _env2 = _interopRequireDefault(_env);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var hostname = _env2.default.hostname;
    var wakanda = new _wakandaClient.WakandaClient('http://' + hostname + ':8081');

    function Auth() {
        var self = this;

        function reset() {
            self.user = { 'fullName': 'Guest' };
            self.logged = false;
        }

        function getCurrentUser(resolveCb, refuseCb) {
            wakanda.directory.currentUser().then(function (user) {
                self.user = user;
                self.logged = true;
                resolveCb({ result: true, value: user });
            }, function (err) {
                reset();
                resolveCb({ result: false, message: err.message });
            });
        }

        self.setCurrentUser = function () {
            return new Promise(getCurrentUser);
        };

        self.logout = function () {
            return wakanda.directory.logout().then(function () {
                reset();
            }).catch(function (err) {
                reset();
            });
        };

        reset();
    }
});
define('services/env',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = { hostname: window.location.hostname };


  var datas = { routeRequest: 'home' };
  var setData = function setData(name, value) {
    datas[name] = value;
  };

  exports.datas = datas;
  exports.setData = setData;
});
define('services/utils',['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = utils;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
		return typeof obj;
	} : function (obj) {
		return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	};

	function utils() {
		this.baseURL = 'http://' + window.location.host + '/';
		this.round = function (number, nbDecimal) {
			var returnNb;
			switch (nbDecimal) {
				case 1:
					returnNb = Math.round(number * 10) / 10;
					break;
				case 2:
					returnNb = Math.round(number * 100) / 100;
					break;
				case 3:
					returnNb = Math.round(number * 1000) / 1000;
					break;
				case 4:
					returnNb = Math.round(number * 10000) / 10000;
					break;
			}
			return returnNb;
		};

		this.getURLAttribute = function (name, getAll) {
			var result = getAll === true ? {} : "Not found",
			    tmp = [];
			location.search.substr(1).split("&").forEach(function (item) {
				if (getAll !== true) {
					tmp = item.split("=");
					if (tmp[0] === name) {
						result = decodeURIComponent(tmp[1]);
					}
				} else {
					tmp = item.split("=");
					result[tmp[0]] = tmp[1];
				}
			});
			return result;
		};

		this.addDays = function (date, days) {
			date.setDate(date.getDate() + parseInt(days, 10));
			return date;
		};

		this.toUTCDate = function (date) {
			var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
			return utc;
		};

		this.millisToUTCDate = function (millis) {
			return this.toUTCDate(new Date(millis));
		};

		this.checkDST = function (date, getOffset) {
			var result;
			getOffset = getOffset == null ? false : getOffset;

			if (new Date().getTimezoneOffset() === date.getTimezoneOffset()) {
				result = true;
			} else {
				result = false;
			}
			if (getOffset) {
				return date.getTimezoneOffset();
			} else {
				return result;
			}
		};

		this.selectText = function (element) {
			var text = element,
			    range,
			    selection;

			if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(text);
				range.select();
			} else if (window.getSelection) {
				selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(text);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		};

		this.compare_entiers_func = function (a, b) {
			return parseInt(a, 10) - parseInt(b, 10);
		};

		this.size = function (obj) {
			var size = 0,
			    key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) size++;
			}
			return size;
		};

		this.generateUUID = function () {
			var d = new Date().now();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = (d + Math.random() * 16) % 16 | 0;
				d = Math.floor(d / 16);
				return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
			});
			return uuid;
		};

		this.isDataAdmin = function () {
			return waf.directory.currentUserBelongsTo('DataAdmin');
		};

		this.map = function (collection) {
			var colMap = [];
			collection.forEach(function (col) {
				colMap[col.ID] = col;
			});
			return colMap;
		};

		this.arrayToDatasource = function (array, attributeName) {
			var returnDatasource = [],
			    i;
			for (i = 0; i < array.length; i++) {
				returnDatasource[i] = {};
				returnDatasource[i][attributeName] = array[i];
			}

			return returnDatasource;
		};

		this.datasourceToArray = function (dataSource, attributeName) {
			var returnArray = [],
			    i;

			for (i = 0; i < dataSource.length; i++) {
				returnArray[i] = dataSource[i][attributeName];
			}

			return returnArray;
		};

		this.findInArray = function (array, value, attributeName, getObject) {
			var array2;
			if (array instanceof Array && array.length > 0) {
				if (_typeof(array[0]) === 'object') {
					array2 = this.datasourceToArray(array, attributeName);
				} else {
					array2 = array;
				}
				if (array2.indexOf(value) === -1) {
					return false;
				} else {
					if (getObject) {
						return array[array2.indexOf(value)];
					} else {
						return true;
					}
				}
			} else {
				return false;
			}
		};

		this.arrayDiff = function (a1, a2) {

			var a = [],
			    diff = [];
			for (var i = 0; i < a1.length; i++) {
				a[a1[i]] = true;
			}for (var i = 0; i < a2.length; i++) {
				if (a[a2[i]]) delete a[a2[i]];else a[a2[i]] = true;
			}for (var k in a) {
				diff.push(k);
			}return diff;
		};

		this.getSameValues = function (arr1, arr2) {
			var i,
			    j,
			    returnArray = [];
			for (i = 0; i < arr1.length; i++) {
				for (j = 0; j < arr2.length; j++) {
					if (arr1[i] === arr2[j]) {
						returnArray.push(arr1[i]);
						break;
					}
				}
			}
			return returnArray;
		};

		this.isURL = function (url) {
			var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
			return regexp.test(url);
		};

		this.check_password_safety = function (pwd, feedback, safetypwd) {

			var msg = "";
			var points = pwd.length;
			var password_info = document.getElementById(feedback);

			var has_letter = new RegExp("[a-z]");
			var has_caps = new RegExp("[A-Z]");
			var has_numbers = new RegExp("[0-9]");
			var has_symbols = new RegExp("\\W");

			if (has_letter.test(pwd)) {
				points += 4;
			}
			if (has_caps.test(pwd)) {
				points += 4;
			}
			if (has_numbers.test(pwd)) {
				points += 4;
			}
			if (has_symbols.test(pwd)) {
				points += 4;
			}

			if (points >= 24) {
				msg = '<span style="color: #0f0;">Your password is strong!</span>';
				$$(safetypwd).setValue('/images/002_35.png');
				$$(safetypwd).show();
			} else if (points >= 16) {
				msg = '<span style="color: #81BEF7;">Your password is medium!</span>';
				$$(safetypwd).setValue('/images/002_36.png');
				$$(safetypwd).show();
			} else if (points >= 12) {
				msg = '<span style="color: #fa0;">Your password is weak!</span>';
				$$(safetypwd).setValue('/images/002_37.png');
				$$(safetypwd).show();
			} else {
				msg = '<span style="color: red;">Your password is very weak!</span>';
				$$(safetypwd).setValue('/images/002_38.png');
				$$(safetypwd).show();
			}

			password_info.innerHTML = msg;
		};

		this.check_password_entropy = function (password) {
			var alphabet = 0,
			    lower = false,
			    upper = false,
			    numbers = false,
			    symbols1 = false,
			    symbols2 = false,
			    other = '',
			    c;

			for (var i = 0; i < password.length; i++) {
				c = password[i];
				if (!lower && 'abcdefghijklmnopqrstuvwxyz'.indexOf(c) >= 0) {
					alphabet += 26;
					lower = true;
				} else if (!upper && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) >= 0) {
					alphabet += 26;
					upper = true;
				} else if (!numbers && '0123456789'.indexOf(c) >= 0) {
					alphabet += 10;
					numbers = true;
				} else if (!symbols1 && '!@#$%^&*()'.indexOf(c) >= 0) {
					alphabet += 10;
					symbols1 = true;
				} else if (!symbols2 && '~`-_=+[]{}\|;:",.<>?' + "'".indexOf(c) >= 0) {
					alphabet += 22;
					symbols2 = true;
				} else if (other.indexOf(c) === -1) {
					alphabet += 1;
					other += c;
				}
			}

			if (password.length === 0) return 0;
			var entropy = password.length * Math.log(alphabet) / Math.log(2);
			return Math.round(entropy * 100) / 100 + ' bits';
		};

		this.getImageOriginalSize = function (imgSrc) {
			var newImg = new Image();

			return new Promise(function (resolve, refuse) {
				newImg.onload = function () {
					var height = newImg.height;
					var width = newImg.width;
					resolve({ height: height, width: width });
				};
				newImg.src = imgSrc;
			});
		};

		this.getNavigatorLanguage = function () {
			var language = navigator.language;

			if (language.length === 2) {
				return language;
			} else if (language.length === 4) {
				return language.substr(0, 2);
			}
		};
	}
});
define('worktime/grid',['exports', 'wakanda-client', 'aurelia-router', 'services/Auth', 'aurelia-materialize-bridge', 'services/utils', 'services/env'], function (exports, _wakandaClient, _aureliaRouter, _Auth, _aureliaMaterializeBridge, _utils, _env) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Grid = Grid;

    var _utils2 = _interopRequireDefault(_utils);

    var _env2 = _interopRequireDefault(_env);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var hostname = _env2.default.hostname;
    var wakanda = new _wakandaClient.WakandaClient('http://' + hostname + ':8081');
    var PAGE_SIZE = 5;

    function Grid(auth, router, utilsService, toast) {
        var self = this;
        this.auth = auth;
        this.showFirstLast = true;
        this.router = router;
        this.route = 'worktime';
        this.utils = utilsService;
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

        wakanda.getCatalog(['WorkTime', 'Client', 'Category', 'CategoryUser', 'User']).then(function (ds) {
            self.getAll = function (start) {
                return ds.WorkTime.query({
                    filter: 'ID >= 0',
                    pageSize: PAGE_SIZE,
                    start: start,
                    orderBy: 'start desc'
                }).then(function (evt) {
                    self.worktimes = evt;
                    self.paginationPages = Math.ceil(evt._count / evt._pageSize);
                }).catch(function (err) {});
            };

            self.pageChanged = function (e) {
                self.startFrom = PAGE_SIZE * (e.detail - 1);
                self.getAll(self.startFrom);
            };

            self.deleteTime = function (ID) {
                ds.WorkTime.find(ID).then(function (entity) {
                    entity.delete().then(function () {
                        self.toast.show('Time deleted!', 5000, 'green bold');
                        self.getAll(self.startFrom);
                    }).catch(function (e) {
                        self.toast.show('Time can\'t be deleted!', 5000, 'red bold');
                    });
                }).catch(function (e) {
                    self.toast.show('Time not found!', 5000, 'red bold');
                });
            };
            self.getAll(0);
        });
    }
    Grid.inject = [_Auth.Auth, _aureliaRouter.AppRouter, _utils2.default, _aureliaMaterializeBridge.MdToastService];
});
define('worktime/w-form',['exports', 'wakanda-client', 'aurelia-router', 'aurelia-framework', 'aurelia-validation', 'aurelia-materialize-bridge', 'services/Auth', 'moment', 'services/env'], function (exports, _wakandaClient, _aureliaRouter, _aureliaFramework, _aureliaValidation, _aureliaMaterializeBridge, _Auth, _moment, _env) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.WForm = undefined;

    var _moment2 = _interopRequireDefault(_moment);

    var _env2 = _interopRequireDefault(_env);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _dec, _dec2, _class, _desc, _value, _class2, _descriptor;

    var hostname = _env2.default.hostname;
    var wakanda = new _wakandaClient.WakandaClient('http://' + hostname + ':8081');

    var WForm = exports.WForm = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.AppRouter, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController), _Auth.Auth, _aureliaMaterializeBridge.MdToastService), _dec2 = (0, _aureliaFramework.observable)(), _dec(_class = (_class2 = function () {
        function WForm(router, validationController, auth, toast) {
            _classCallCheck(this, WForm);

            this.disableCategorySelect = true;

            _initDefineProp(this, 'selectedClient', _descriptor, this);

            this.selectedCategory = '';
            this.endDateDifferent = false;
            this.startDate = new Date();
            this.endDate = new Date();
            this.startTime = (0, _moment2.default)().format('HH:mm');
            this.endTime = (0, _moment2.default)().format('HH:mm');
            this.showBreak = false;
            this.showTrain = false;

            this.router = router;
            this.validationController = validationController;
            this.validationController.addRenderer(new _aureliaMaterializeBridge.MaterializeFormValidationRenderer());
            this.auth = auth;
            this.toast = toast;
        }

        WForm.prototype.canActivate = function canActivate() {
            if (!this.auth.logged) {
                this.router.navigate('login');
            } else {
                return true;
            }
        };

        WForm.prototype.activate = function activate(params) {
            this.ID = params.id;
        };

        WForm.prototype.bind = function bind() {};

        WForm.prototype.attached = function attached() {
            var _this = this;

            wakanda.getCatalog().then(function (ds) {
                _this.ds = ds;
                _this.getEntity = function (ID) {
                    ds.WorkTime.find(ID).then(function (worktime) {
                        _this.worktime = worktime;
                        _this.selectedClient = worktime.client._key;
                        _this.clientSelect.refresh();

                        _this.startDate = new Date(worktime.start);
                        _this.endDate = new Date(worktime.end);
                        _this.startTime = (0, _moment2.default)(worktime.start).format('HH:mm');
                        _this.endTime = (0, _moment2.default)(worktime.end).format('HH:mm');

                        _this.breakTime = worktime.breakTime;
                        _this.trainTime = worktime.trainTime;

                        _this.comment = worktime.comment;
                        _this.breakReason = worktime.breakReason;
                        _this.trainPrice = worktime.trainPrice;

                        if ((0, _moment2.default)(_this.startDate).format('YYYYMMDD') !== (0, _moment2.default)(_this.endDate).format('YYYYMMDD')) {
                            _this.endDateDifferent = true;
                        }

                        if (worktime.breakTime !== '' && worktime.breakTime !== '00:00' && worktime.breakTime !== null && worktime.breakTime !== 0 && worktime.breakTime !== undefined) {
                            _this.showBreak = true;
                        }
                        if (worktime.trainTime !== '' && worktime.trainTime !== '00:00' && worktime.trainTime !== null && worktime.trainTime !== 0 && worktime.trainTime !== undefined || worktime.trainPrice !== '' && worktime.trainPrice !== null && worktime.trainPrice !== undefined && worktime.trainPrice !== 0) {
                            _this.showTrain = true;
                        }
                    }).catch(function (err) {});
                };

                ds.Client.query({ filter: 'ID >= 0' }).then(function (clients) {
                    _this.clients = clients.entities;
                    console.log(_this.clientSelect);
                    _this.clientSelect.refresh();
                });

                if (_this.ID) {
                    _this.edition = true;
                    _this.getEntity(_this.ID);
                } else {
                    _this.edition = false;
                    _this.worktime = ds.WorkTime.create();
                }
            }).catch(function (err) {});
        };

        WForm.prototype.save = function save() {
            var _this2 = this;

            console.log('save');
            this.validationController.validate().then(function (v) {
                if (v.length === 0) {
                    _this2.ds.Client.query({
                        filter: 'ID = :1',
                        params: [_this2.selectedClient]
                    }).then(function (evt) {
                        _this2.worktime.client = evt.entities[0];
                        _this2.ds.Category.query({
                            filter: 'ID = :1',
                            params: [_this2.selectedCategory]
                        }).then(function (evt2) {
                            _this2.worktime.category = evt2.entities[0];
                            _this2.worktime.start = (0, _moment2.default)(_this2.startDate).hour(_this2.startTime.substr(0, 2)).minute(_this2.startTime.substr(3, 2)).second(0).millisecond(0)._d;
                            _this2.worktime.end = (0, _moment2.default)(_this2.endDate).hour(_this2.endTime.substr(0, 2)).minute(_this2.endTime.substr(3, 2)).second(0).millisecond(0)._d;
                            _this2.worktime.comment = _this2.comment;

                            if (_this2.showBreak) {
                                _this2.worktime.breakTime = _this2.breakTime;
                                _this2.worktime.breakReason = _this2.breakReason;
                            }

                            if (_this2.showTrain) {
                                _this2.worktime.trainTime = _this2.trainTime;
                                _this2.worktime.trainPrice = _this2.trainPrice;
                            }
                            _this2.worktime.save().then(function (evt3) {
                                if (_this2.edition) {
                                    _this2.toast.show('Entity edited!', 5000, 'green bold');
                                } else {
                                    _this2.toast.show('Entity saved!', 5000, 'green bold');
                                    _this2.toast.show('You can create a new time', 5000, 'green bold');
                                    _this2.worktime = _this2.ds.WorkTime.create();
                                }
                            });
                        });
                    });
                } else {
                    _this2.toast.show('Check the errors.', 5000, 'red bold');
                }
            });
        };

        WForm.prototype.navigateBack = function navigateBack() {
            this.router.navigateBack();
        };

        WForm.prototype.selectedClientChanged = function selectedClientChanged() {
            var _this3 = this;

            var clientID = this.worktime.client && this.worktime.client._key && this.worktime.client._key && this.selectedClient === undefined ? this.worktime.client._key : this.selectedClient;
            this.disableCategorySelect = false;
            this.ds && this.ds.Category.query({ filter: 'client.ID == :1', params: [clientID] }).then(function (result) {
                _this3.categories = result.entities;
                if (_this3.categories.length === 1) {
                    _this3.selectedCategory = _this3.categories[0].ID;
                } else {
                    _this3.selectedCategory = '';
                }
                if (_this3.worktime.category !== null) {
                    _this3.selectedCategory = _this3.worktime.category._key;
                }
                _this3.categorySelect.refresh();
            });
        };

        return WForm;
    }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'selectedClient', [_dec2], {
        enumerable: true,
        initializer: function initializer() {
            return '';
        }
    })), _class2)) || _class);

    _aureliaValidation.ValidationRules.ensure('selectedClient').displayName('Client').required().ensure('selectedCategory').displayName('Category').required().ensure('startDate').required().ensure('startTime').required().ensure('endTime').required().ensure('comment').required().on(WForm);
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
            config.map([{ route: '', moduleId: './grid', nav: false, title: '' }, { route: '/add', moduleId: './w-form', nav: false, title: '' }, { route: ':id', moduleId: './w-form', nav: false, title: '' }]);
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

    var DatePickerCustomElement = exports.DatePickerCustomElement = (0, _aureliaFramework.decorators)((0, _aureliaFramework.bindable)({ name: 'dpdate', defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), (0, _aureliaFramework.bindable)({ name: 'dpid', defaultBindingMode: _aureliaFramework.bindingMode.oneTime }), (0, _aureliaFramework.bindable)({ name: 'dplabel', defaultBindingMode: _aureliaFramework.bindingMode.oneTime })).on(function () {
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
            if (value === null) {
                return '';
            }
            return (0, _moment2.default)(value).format(format);
        };

        DateFormatValueConverter.prototype.fromView = function fromView(value, format) {
            if (value === '') {
                return null;
            }
            return (0, _moment2.default)(value, format).toDate();
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/validate-binding-behavior',["require", "exports", 'aurelia-task-queue', './validate-trigger', './validate-binding-behavior-base'], function (require, exports, aurelia_task_queue_1, validate_trigger_1, validate_binding_behavior_base_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the validate trigger specified by the associated controller's
     * validateTrigger property occurs.
     */
    var ValidateBindingBehavior = (function (_super) {
        __extends(ValidateBindingBehavior, _super);
        function ValidateBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateBindingBehavior.prototype.getValidateTrigger = function (controller) {
            return controller.validateTrigger;
        };
        ValidateBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateBindingBehavior = ValidateBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property will be validated
     * manually, by calling controller.validate(). No automatic validation
     * triggered by data-entry or blur will occur.
     */
    var ValidateManuallyBindingBehavior = (function (_super) {
        __extends(ValidateManuallyBindingBehavior, _super);
        function ValidateManuallyBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateManuallyBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.manual;
        };
        ValidateManuallyBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateManuallyBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateManuallyBindingBehavior = ValidateManuallyBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs.
     */
    var ValidateOnBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnBlurBindingBehavior, _super);
        function ValidateOnBlurBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateOnBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.blur;
        };
        ValidateOnBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateOnBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateOnBlurBindingBehavior = ValidateOnBlurBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element is changed by the user, causing a change
     * to the model.
     */
    var ValidateOnChangeBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeBindingBehavior, _super);
        function ValidateOnChangeBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateOnChangeBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.change;
        };
        ValidateOnChangeBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateOnChangeBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateOnChangeBindingBehavior = ValidateOnChangeBindingBehavior;
    /**
     * Binding behavior. Indicates the bound property should be validated
     * when the associated element blurs or is changed by the user, causing
     * a change to the model.
     */
    var ValidateOnChangeOrBlurBindingBehavior = (function (_super) {
        __extends(ValidateOnChangeOrBlurBindingBehavior, _super);
        function ValidateOnChangeOrBlurBindingBehavior() {
            _super.apply(this, arguments);
        }
        ValidateOnChangeOrBlurBindingBehavior.prototype.getValidateTrigger = function () {
            return validate_trigger_1.validateTrigger.changeOrBlur;
        };
        ValidateOnChangeOrBlurBindingBehavior.inject = [aurelia_task_queue_1.TaskQueue];
        return ValidateOnChangeOrBlurBindingBehavior;
    }(validate_binding_behavior_base_1.ValidateBindingBehaviorBase));
    exports.ValidateOnChangeOrBlurBindingBehavior = ValidateOnChangeOrBlurBindingBehavior;
});

define('aurelia-validation/validate-trigger',["require", "exports"], function (require, exports) {
    "use strict";
    /**
    * Validation triggers.
    */
    exports.validateTrigger = {
        /**
        * Manual validation.  Use the controller's `validate()` and  `reset()` methods
        * to validate all bindings.
        */
        manual: 0,
        /**
        * Validate the binding when the binding's target element fires a DOM "blur" event.
        */
        blur: 1,
        /**
        * Validate the binding when it updates the model due to a change in the view.
        */
        change: 2,
        /**
         * Validate the binding when the binding's target element fires a DOM "blur" event and
         * when it updates the model due to a change in the view.
         */
        changeOrBlur: 3
    };
});

define('aurelia-validation/validate-binding-behavior-base',["require", "exports", 'aurelia-dependency-injection', 'aurelia-pal', './validation-controller', './validate-trigger'], function (require, exports, aurelia_dependency_injection_1, aurelia_pal_1, validation_controller_1, validate_trigger_1) {
    "use strict";
    /**
     * Binding behavior. Indicates the bound property should be validated.
     */
    var ValidateBindingBehaviorBase = (function () {
        function ValidateBindingBehaviorBase(taskQueue) {
            this.taskQueue = taskQueue;
        }
        /**
        * Gets the DOM element associated with the data-binding. Most of the time it's
        * the binding.target but sometimes binding.target is an aurelia custom element,
        * or custom attribute which is a javascript "class" instance, so we need to use
        * the controller's container to retrieve the actual DOM element.
        */
        ValidateBindingBehaviorBase.prototype.getTarget = function (binding, view) {
            var target = binding.target;
            // DOM element
            if (target instanceof Element) {
                return target;
            }
            // custom element or custom attribute
            for (var i = 0, ii = view.controllers.length; i < ii; i++) {
                var controller = view.controllers[i];
                if (controller.viewModel === target) {
                    var element = controller.container.get(aurelia_pal_1.DOM.Element);
                    if (element) {
                        return element;
                    }
                    throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
                }
            }
            throw new Error("Unable to locate target element for \"" + binding.sourceExpression + "\".");
        };
        ValidateBindingBehaviorBase.prototype.bind = function (binding, source, rulesOrController, rules) {
            var _this = this;
            // identify the target element.
            var target = this.getTarget(binding, source);
            // locate the controller.
            var controller;
            if (rulesOrController instanceof validation_controller_1.ValidationController) {
                controller = rulesOrController;
            }
            else {
                controller = source.container.get(aurelia_dependency_injection_1.Optional.of(validation_controller_1.ValidationController));
                rules = rulesOrController;
            }
            if (controller === null) {
                throw new Error("A ValidationController has not been registered.");
            }
            controller.registerBinding(binding, target, rules);
            binding.validationController = controller;
            var trigger = this.getValidateTrigger(controller);
            if (trigger & validate_trigger_1.validateTrigger.change) {
                binding.standardUpdateSource = binding.updateSource;
                binding.updateSource = function (value) {
                    this.standardUpdateSource(value);
                    this.validationController.validateBinding(this);
                };
            }
            if (trigger & validate_trigger_1.validateTrigger.blur) {
                binding.validateBlurHandler = function () {
                    _this.taskQueue.queueMicroTask(function () { return controller.validateBinding(binding); });
                };
                binding.validateTarget = target;
                target.addEventListener('blur', binding.validateBlurHandler);
            }
            if (trigger !== validate_trigger_1.validateTrigger.manual) {
                binding.standardUpdateTarget = binding.updateTarget;
                binding.updateTarget = function (value) {
                    this.standardUpdateTarget(value);
                    this.validationController.resetBinding(this);
                };
            }
        };
        ValidateBindingBehaviorBase.prototype.unbind = function (binding) {
            // reset the binding to it's original state.
            if (binding.standardUpdateSource) {
                binding.updateSource = binding.standardUpdateSource;
                binding.standardUpdateSource = null;
            }
            if (binding.standardUpdateTarget) {
                binding.updateTarget = binding.standardUpdateTarget;
                binding.standardUpdateTarget = null;
            }
            if (binding.validateBlurHandler) {
                binding.validateTarget.removeEventListener('blur', binding.validateBlurHandler);
                binding.validateBlurHandler = null;
                binding.validateTarget = null;
            }
            binding.validationController.unregisterBinding(binding);
            binding.validationController = null;
        };
        return ValidateBindingBehaviorBase;
    }());
    exports.ValidateBindingBehaviorBase = ValidateBindingBehaviorBase;
});

define('aurelia-validation/validation-controller',["require", "exports", './validator', './validate-trigger', './property-info', './validation-error'], function (require, exports, validator_1, validate_trigger_1, property_info_1, validation_error_1) {
    "use strict";
    /**
     * Orchestrates validation.
     * Manages a set of bindings, renderers and objects.
     * Exposes the current list of validation errors for binding purposes.
     */
    var ValidationController = (function () {
        function ValidationController(validator) {
            this.validator = validator;
            // Registered bindings (via the validate binding behavior)
            this.bindings = new Map();
            // Renderers that have been added to the controller instance.
            this.renderers = [];
            /**
             * Errors that have been rendered by the controller.
             */
            this.errors = [];
            /**
             *  Whether the controller is currently validating.
             */
            this.validating = false;
            // Elements related to errors that have been rendered.
            this.elements = new Map();
            // Objects that have been added to the controller instance (entity-style validation).
            this.objects = new Map();
            /**
             * The trigger that will invoke automatic validation of a property used in a binding.
             */
            this.validateTrigger = validate_trigger_1.validateTrigger.blur;
            // Promise that resolves when validation has completed.
            this.finishValidating = Promise.resolve();
        }
        /**
         * Adds an object to the set of objects that should be validated when validate is called.
         * @param object The object.
         * @param rules Optional. The rules. If rules aren't supplied the Validator implementation will lookup the rules.
         */
        ValidationController.prototype.addObject = function (object, rules) {
            this.objects.set(object, rules);
        };
        /**
         * Removes an object from the set of objects that should be validated when validate is called.
         * @param object The object.
         */
        ValidationController.prototype.removeObject = function (object) {
            this.objects.delete(object);
            this.processErrorDelta('reset', this.errors.filter(function (error) { return error.object === object; }), []);
        };
        /**
         * Adds and renders a ValidationError.
         */
        ValidationController.prototype.addError = function (message, object, propertyName) {
            var error = new validation_error_1.ValidationError({}, message, object, propertyName);
            this.processErrorDelta('validate', [], [error]);
            return error;
        };
        /**
         * Removes and unrenders a ValidationError.
         */
        ValidationController.prototype.removeError = function (error) {
            if (this.errors.indexOf(error) !== -1) {
                this.processErrorDelta('reset', [error], []);
            }
        };
        /**
         * Adds a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.addRenderer = function (renderer) {
            var _this = this;
            this.renderers.push(renderer);
            renderer.render({
                kind: 'validate',
                render: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); }),
                unrender: []
            });
        };
        /**
         * Removes a renderer.
         * @param renderer The renderer.
         */
        ValidationController.prototype.removeRenderer = function (renderer) {
            var _this = this;
            this.renderers.splice(this.renderers.indexOf(renderer), 1);
            renderer.render({
                kind: 'reset',
                render: [],
                unrender: this.errors.map(function (error) { return ({ error: error, elements: _this.elements.get(error) }); })
            });
        };
        /**
         * Registers a binding with the controller.
         * @param binding The binding instance.
         * @param target The DOM element.
         * @param rules (optional) rules associated with the binding. Validator implementation specific.
         */
        ValidationController.prototype.registerBinding = function (binding, target, rules) {
            this.bindings.set(binding, { target: target, rules: rules });
        };
        /**
         * Unregisters a binding with the controller.
         * @param binding The binding instance.
         */
        ValidationController.prototype.unregisterBinding = function (binding) {
            this.resetBinding(binding);
            this.bindings.delete(binding);
        };
        /**
         * Interprets the instruction and returns a predicate that will identify
         * relevant errors in the list of rendered errors.
         */
        ValidationController.prototype.getInstructionPredicate = function (instruction) {
            if (instruction) {
                var object_1 = instruction.object, propertyName_1 = instruction.propertyName, rules_1 = instruction.rules;
                var predicate_1;
                if (instruction.propertyName) {
                    predicate_1 = function (x) { return x.object === object_1 && x.propertyName === propertyName_1; };
                }
                else {
                    predicate_1 = function (x) { return x.object === object_1; };
                }
                // todo: move to Validator interface:
                if (rules_1 && rules_1.indexOf) {
                    return function (x) { return predicate_1(x) && rules_1.indexOf(x.rule) !== -1; };
                }
                return predicate_1;
            }
            else {
                return function () { return true; };
            }
        };
        /**
         * Validates and renders errors.
         * @param instruction Optional. Instructions on what to validate. If undefined, all objects and bindings will be validated.
         */
        ValidationController.prototype.validate = function (instruction) {
            var _this = this;
            // Get a function that will process the validation instruction.
            var execute;
            if (instruction) {
                var object_2 = instruction.object, propertyName_2 = instruction.propertyName, rules_2 = instruction.rules;
                // if rules were not specified, check the object map.
                rules_2 = rules_2 || this.objects.get(object_2);
                // property specified?
                if (instruction.propertyName === undefined) {
                    // validate the specified object.
                    execute = function () { return _this.validator.validateObject(object_2, rules_2); };
                }
                else {
                    // validate the specified property.
                    execute = function () { return _this.validator.validateProperty(object_2, propertyName_2, rules_2); };
                }
            }
            else {
                // validate all objects and bindings.
                execute = function () {
                    var promises = [];
                    for (var _i = 0, _a = Array.from(_this.objects); _i < _a.length; _i++) {
                        var _b = _a[_i], object = _b[0], rules = _b[1];
                        promises.push(_this.validator.validateObject(object, rules));
                    }
                    for (var _c = 0, _d = Array.from(_this.bindings); _c < _d.length; _c++) {
                        var _e = _d[_c], binding = _e[0], rules = _e[1].rules;
                        var _f = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _f.object, propertyName = _f.propertyName;
                        if (_this.objects.has(object)) {
                            continue;
                        }
                        promises.push(_this.validator.validateProperty(object, propertyName, rules));
                    }
                    return Promise.all(promises).then(function (errorSets) { return errorSets.reduce(function (a, b) { return a.concat(b); }, []); });
                };
            }
            // Wait for any existing validation to finish, execute the instruction, render the errors.
            this.validating = true;
            var result = this.finishValidating
                .then(execute)
                .then(function (newErrors) {
                var predicate = _this.getInstructionPredicate(instruction);
                var oldErrors = _this.errors.filter(predicate);
                _this.processErrorDelta('validate', oldErrors, newErrors);
                if (result === _this.finishValidating) {
                    _this.validating = false;
                }
                return newErrors;
            })
                .catch(function (error) {
                // recover, to enable subsequent calls to validate()
                _this.validating = false;
                _this.finishValidating = Promise.resolve();
                return Promise.reject(error);
            });
            this.finishValidating = result;
            return result;
        };
        /**
         * Resets any rendered errors (unrenders).
         * @param instruction Optional. Instructions on what to reset. If unspecified all rendered errors will be unrendered.
         */
        ValidationController.prototype.reset = function (instruction) {
            var predicate = this.getInstructionPredicate(instruction);
            var oldErrors = this.errors.filter(predicate);
            this.processErrorDelta('reset', oldErrors, []);
        };
        /**
         * Gets the elements associated with an object and propertyName (if any).
         */
        ValidationController.prototype.getAssociatedElements = function (_a) {
            var object = _a.object, propertyName = _a.propertyName;
            var elements = [];
            for (var _i = 0, _b = Array.from(this.bindings); _i < _b.length; _i++) {
                var _c = _b[_i], binding = _c[0], target = _c[1].target;
                var _d = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), o = _d.object, p = _d.propertyName;
                if (o === object && p === propertyName) {
                    elements.push(target);
                }
            }
            return elements;
        };
        ValidationController.prototype.processErrorDelta = function (kind, oldErrors, newErrors) {
            // prepare the instruction.
            var instruction = {
                kind: kind,
                render: [],
                unrender: []
            };
            // create a shallow copy of newErrors so we can mutate it without causing side-effects.
            newErrors = newErrors.slice(0);
            // create unrender instructions from the old errors.
            var _loop_1 = function(oldError) {
                // get the elements associated with the old error.
                var elements = this_1.elements.get(oldError);
                // remove the old error from the element map.
                this_1.elements.delete(oldError);
                // create the unrender instruction.
                instruction.unrender.push({ error: oldError, elements: elements });
                // determine if there's a corresponding new error for the old error we are unrendering.
                var newErrorIndex = newErrors.findIndex(function (x) { return x.rule === oldError.rule && x.object === oldError.object && x.propertyName === oldError.propertyName; });
                if (newErrorIndex === -1) {
                    // no corresponding new error... simple remove.
                    this_1.errors.splice(this_1.errors.indexOf(oldError), 1);
                }
                else {
                    // there is a corresponding new error...        
                    var newError = newErrors.splice(newErrorIndex, 1)[0];
                    // get the elements that are associated with the new error.
                    var elements_1 = this_1.getAssociatedElements(newError);
                    this_1.elements.set(newError, elements_1);
                    // create a render instruction for the new error.
                    instruction.render.push({ error: newError, elements: elements_1 });
                    // do an in-place replacement of the old error with the new error.
                    // this ensures any repeats bound to this.errors will not thrash.
                    this_1.errors.splice(this_1.errors.indexOf(oldError), 1, newError);
                }
            };
            var this_1 = this;
            for (var _i = 0, oldErrors_1 = oldErrors; _i < oldErrors_1.length; _i++) {
                var oldError = oldErrors_1[_i];
                _loop_1(oldError);
            }
            // create render instructions from the remaining new errors.
            for (var _a = 0, newErrors_1 = newErrors; _a < newErrors_1.length; _a++) {
                var error = newErrors_1[_a];
                var elements = this.getAssociatedElements(error);
                instruction.render.push({ error: error, elements: elements });
                this.elements.set(error, elements);
                this.errors.push(error);
            }
            // render.
            for (var _b = 0, _c = this.renderers; _b < _c.length; _b++) {
                var renderer = _c[_b];
                renderer.render(instruction);
            }
        };
        /**
        * Validates the property associated with a binding.
        */
        ValidationController.prototype.validateBinding = function (binding) {
            if (!binding.isBound) {
                return;
            }
            var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
            var registeredBinding = this.bindings.get(binding);
            var rules = registeredBinding ? registeredBinding.rules : undefined;
            this.validate({ object: object, propertyName: propertyName, rules: rules });
        };
        /**
        * Resets the errors for a property associated with a binding.
        */
        ValidationController.prototype.resetBinding = function (binding) {
            var _a = property_info_1.getPropertyInfo(binding.sourceExpression, binding.source), object = _a.object, propertyName = _a.propertyName;
            this.reset({ object: object, propertyName: propertyName });
        };
        ValidationController.inject = [validator_1.Validator];
        return ValidationController;
    }());
    exports.ValidationController = ValidationController;
});

define('aurelia-validation/validator',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var Validator = (function () {
        function Validator() {
        }
        return Validator;
    }());
    exports.Validator = Validator;
});

define('aurelia-validation/property-info',["require", "exports", 'aurelia-binding'], function (require, exports, aurelia_binding_1) {
    "use strict";
    function getObject(expression, objectExpression, source) {
        var value = objectExpression.evaluate(source, null);
        if (value !== null && (typeof value === 'object' || typeof value === 'function')) {
            return value;
        }
        if (value === null) {
            value = 'null';
        }
        else if (value === undefined) {
            value = 'undefined';
        }
        throw new Error("The '" + objectExpression + "' part of '" + expression + "' evaluates to " + value + " instead of an object.");
    }
    /**
     * Retrieves the object and property name for the specified expression.
     * @param expression The expression
     * @param source The scope
     */
    function getPropertyInfo(expression, source) {
        var originalExpression = expression;
        while (expression instanceof aurelia_binding_1.BindingBehavior || expression instanceof aurelia_binding_1.ValueConverter) {
            expression = expression.expression;
        }
        var object;
        var propertyName;
        if (expression instanceof aurelia_binding_1.AccessScope) {
            object = source.bindingContext;
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessMember) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.name;
        }
        else if (expression instanceof aurelia_binding_1.AccessKeyed) {
            object = getObject(originalExpression, expression.object, source);
            propertyName = expression.key.evaluate(source);
        }
        else {
            throw new Error("Expression '" + originalExpression + "' is not compatible with the validate binding-behavior.");
        }
        return { object: object, propertyName: propertyName };
    }
    exports.getPropertyInfo = getPropertyInfo;
});

define('aurelia-validation/validation-error',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * A validation error.
     */
    var ValidationError = (function () {
        /**
         * @param rule The rule associated with the error. Validator implementation specific.
         * @param message The error message.
         * @param object The invalid object
         * @param propertyName The name of the invalid property. Optional.
         */
        function ValidationError(rule, message, object, propertyName) {
            if (propertyName === void 0) { propertyName = null; }
            this.rule = rule;
            this.message = message;
            this.object = object;
            this.propertyName = propertyName;
            this.id = ValidationError.nextId++;
        }
        ValidationError.prototype.toString = function () {
            return this.message;
        };
        ValidationError.nextId = 0;
        return ValidationError;
    }());
    exports.ValidationError = ValidationError;
});

define('aurelia-validation/validation-controller-factory',["require", "exports", './validation-controller', './validator'], function (require, exports, validation_controller_1, validator_1) {
    "use strict";
    /**
     * Creates ValidationController instances.
     */
    var ValidationControllerFactory = (function () {
        function ValidationControllerFactory(container) {
            this.container = container;
        }
        ValidationControllerFactory.get = function (container) {
            return new ValidationControllerFactory(container);
        };
        /**
         * Creates a new controller instance.
         */
        ValidationControllerFactory.prototype.create = function (validator) {
            if (!validator) {
                validator = this.container.get(validator_1.Validator);
            }
            return new validation_controller_1.ValidationController(validator);
        };
        /**
         * Creates a new controller and registers it in the current element's container so that it's
         * available to the validate binding behavior and renderers.
         */
        ValidationControllerFactory.prototype.createForCurrentScope = function (validator) {
            var controller = this.create(validator);
            this.container.registerInstance(validation_controller_1.ValidationController, controller);
            return controller;
        };
        return ValidationControllerFactory;
    }());
    exports.ValidationControllerFactory = ValidationControllerFactory;
    ValidationControllerFactory['protocol:aurelia:resolver'] = true;
});

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('aurelia-validation/validation-errors-custom-attribute',["require", "exports", 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-templating', './validation-controller'], function (require, exports, aurelia_binding_1, aurelia_dependency_injection_1, aurelia_templating_1, validation_controller_1) {
    "use strict";
    var ValidationErrorsCustomAttribute = (function () {
        function ValidationErrorsCustomAttribute(boundaryElement, controllerAccessor) {
            this.boundaryElement = boundaryElement;
            this.controllerAccessor = controllerAccessor;
            this.errors = [];
        }
        ValidationErrorsCustomAttribute.prototype.sort = function () {
            this.errors.sort(function (a, b) {
                if (a.targets[0] === b.targets[0]) {
                    return 0;
                }
                return a.targets[0].compareDocumentPosition(b.targets[0]) & 2 ? 1 : -1;
            });
        };
        ValidationErrorsCustomAttribute.prototype.interestingElements = function (elements) {
            var _this = this;
            return elements.filter(function (e) { return _this.boundaryElement.contains(e); });
        };
        ValidationErrorsCustomAttribute.prototype.render = function (instruction) {
            var _loop_1 = function(error) {
                var index = this_1.errors.findIndex(function (x) { return x.error === error; });
                if (index !== -1) {
                    this_1.errors.splice(index, 1);
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = instruction.unrender; _i < _a.length; _i++) {
                var error = _a[_i].error;
                _loop_1(error);
            }
            for (var _b = 0, _c = instruction.render; _b < _c.length; _b++) {
                var _d = _c[_b], error = _d.error, elements = _d.elements;
                var targets = this.interestingElements(elements);
                if (targets.length) {
                    this.errors.push({ error: error, targets: targets });
                }
            }
            this.sort();
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.bind = function () {
            this.controllerAccessor().addRenderer(this);
            this.value = this.errors;
        };
        ValidationErrorsCustomAttribute.prototype.unbind = function () {
            this.controllerAccessor().removeRenderer(this);
        };
        ValidationErrorsCustomAttribute.inject = [Element, aurelia_dependency_injection_1.Lazy.of(validation_controller_1.ValidationController)];
        ValidationErrorsCustomAttribute = __decorate([
            aurelia_templating_1.customAttribute('validation-errors', aurelia_binding_1.bindingMode.twoWay)
        ], ValidationErrorsCustomAttribute);
        return ValidationErrorsCustomAttribute;
    }());
    exports.ValidationErrorsCustomAttribute = ValidationErrorsCustomAttribute;
});

define('aurelia-validation/validation-renderer-custom-attribute',["require", "exports", './validation-controller'], function (require, exports, validation_controller_1) {
    "use strict";
    var ValidationRendererCustomAttribute = (function () {
        function ValidationRendererCustomAttribute() {
        }
        ValidationRendererCustomAttribute.prototype.created = function (view) {
            this.container = view.container;
        };
        ValidationRendererCustomAttribute.prototype.bind = function () {
            this.controller = this.container.get(validation_controller_1.ValidationController);
            this.renderer = this.container.get(this.value);
            this.controller.addRenderer(this.renderer);
        };
        ValidationRendererCustomAttribute.prototype.unbind = function () {
            this.controller.removeRenderer(this.renderer);
            this.controller = null;
            this.renderer = null;
        };
        return ValidationRendererCustomAttribute;
    }());
    exports.ValidationRendererCustomAttribute = ValidationRendererCustomAttribute;
});

define('aurelia-validation/implementation/rules',["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Sets, unsets and retrieves rules on an object or constructor function.
     */
    var Rules = (function () {
        function Rules() {
        }
        /**
         * Applies the rules to a target.
         */
        Rules.set = function (target, rules) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            Object.defineProperty(target, Rules.key, { enumerable: false, configurable: false, writable: true, value: rules });
        };
        /**
         * Removes rules from a target.
         */
        Rules.unset = function (target) {
            if (target instanceof Function) {
                target = target.prototype;
            }
            target[Rules.key] = null;
        };
        /**
         * Retrieves the target's rules.
         */
        Rules.get = function (target) {
            return target[Rules.key] || null;
        };
        /**
         * The name of the property that stores the rules.
         */
        Rules.key = '__rules__';
        return Rules;
    }());
    exports.Rules = Rules;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/standard-validator',["require", "exports", 'aurelia-templating', '../validator', '../validation-error', './rules', './validation-messages'], function (require, exports, aurelia_templating_1, validator_1, validation_error_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Validates.
     * Responsible for validating objects and properties.
     */
    var StandardValidator = (function (_super) {
        __extends(StandardValidator, _super);
        function StandardValidator(messageProvider, resources) {
            _super.call(this);
            this.messageProvider = messageProvider;
            this.lookupFunctions = resources.lookupFunctions;
            this.getDisplayName = messageProvider.getDisplayName.bind(messageProvider);
        }
        StandardValidator.prototype.getMessage = function (rule, object, value) {
            var expression = rule.message || this.messageProvider.getMessage(rule.messageKey);
            var _a = rule.property, propertyName = _a.name, displayName = _a.displayName;
            if (displayName === null && propertyName !== null) {
                displayName = this.messageProvider.getDisplayName(propertyName);
            }
            var overrideContext = {
                $displayName: displayName,
                $propertyName: propertyName,
                $value: value,
                $object: object,
                $config: rule.config,
                $getDisplayName: this.getDisplayName
            };
            return expression.evaluate({ bindingContext: object, overrideContext: overrideContext }, this.lookupFunctions);
        };
        StandardValidator.prototype.validateRuleSequence = function (object, propertyName, ruleSequence, sequence) {
            var _this = this;
            // are we validating all properties or a single property?
            var validateAllProperties = propertyName === null || propertyName === undefined;
            var rules = ruleSequence[sequence];
            var errors = [];
            // validate each rule.
            var promises = [];
            var _loop_1 = function(i) {
                var rule = rules[i];
                // is the rule related to the property we're validating.
                if (!validateAllProperties && rule.property.name !== propertyName) {
                    return "continue";
                }
                // is this a conditional rule? is the condition met?
                if (rule.when && !rule.when(object)) {
                    return "continue";
                }
                // validate.
                var value = rule.property.name === null ? object : object[rule.property.name];
                var promiseOrBoolean = rule.condition(value, object);
                if (!(promiseOrBoolean instanceof Promise)) {
                    promiseOrBoolean = Promise.resolve(promiseOrBoolean);
                }
                promises.push(promiseOrBoolean.then(function (isValid) {
                    if (!isValid) {
                        var message = _this.getMessage(rule, object, value);
                        errors.push(new validation_error_1.ValidationError(rule, message, object, rule.property.name));
                    }
                }));
            };
            for (var i = 0; i < rules.length; i++) {
                _loop_1(i);
            }
            return Promise.all(promises)
                .then(function () {
                sequence++;
                if (errors.length === 0 && sequence < ruleSequence.length) {
                    return _this.validateRuleSequence(object, propertyName, ruleSequence, sequence);
                }
                return errors;
            });
        };
        StandardValidator.prototype.validate = function (object, propertyName, rules) {
            // rules specified?
            if (!rules) {
                // no. attempt to locate the rules.
                rules = rules_1.Rules.get(object);
            }
            // any rules?
            if (!rules) {
                return Promise.resolve([]);
            }
            return this.validateRuleSequence(object, propertyName, rules, 0);
        };
        /**
         * Validates the specified property.
         * @param object The object to validate.
         * @param propertyName The name of the property to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateProperty = function (object, propertyName, rules) {
            return this.validate(object, propertyName, rules || null);
        };
        /**
         * Validates all rules for specified object and it's properties.
         * @param object The object to validate.
         * @param rules Optional. If unspecified, the rules will be looked up using the metadata
         * for the object created by ValidationRules....on(class/object)
         */
        StandardValidator.prototype.validateObject = function (object, rules) {
            return this.validate(object, null, rules || null);
        };
        StandardValidator.inject = [validation_messages_1.ValidationMessageProvider, aurelia_templating_1.ViewResources];
        return StandardValidator;
    }(validator_1.Validator));
    exports.StandardValidator = StandardValidator;
});

define('aurelia-validation/implementation/validation-messages',["require", "exports", './validation-parser'], function (require, exports, validation_parser_1) {
    "use strict";
    /**
     * Dictionary of validation messages. [messageKey]: messageExpression
     */
    exports.validationMessages = {
        /**
         * The default validation message. Used with rules that have no standard message.
         */
        default: "${$displayName} is invalid.",
        required: "${$displayName} is required.",
        matches: "${$displayName} is not correctly formatted.",
        email: "${$displayName} is not a valid email.",
        minLength: "${$displayName} must be at least ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        maxLength: "${$displayName} cannot be longer than ${$config.length} character${$config.length === 1 ? '' : 's'}.",
        minItems: "${$displayName} must contain at least ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        maxItems: "${$displayName} cannot contain more than ${$config.count} item${$config.count === 1 ? '' : 's'}.",
        equals: "${$displayName} must be ${$config.expectedValue}.",
    };
    /**
     * Retrieves validation messages and property display names.
     */
    var ValidationMessageProvider = (function () {
        function ValidationMessageProvider(parser) {
            this.parser = parser;
        }
        /**
         * Returns a message binding expression that corresponds to the key.
         * @param key The message key.
         */
        ValidationMessageProvider.prototype.getMessage = function (key) {
            var message;
            if (key in exports.validationMessages) {
                message = exports.validationMessages[key];
            }
            else {
                message = exports.validationMessages['default'];
            }
            return this.parser.parseMessage(message);
        };
        /**
         * When a display name is not provided, this method is used to formulate
         * a display name using the property name.
         * Override this with your own custom logic.
         * @param propertyName The property name.
         */
        ValidationMessageProvider.prototype.getDisplayName = function (propertyName) {
            // split on upper-case letters.
            var words = propertyName.split(/(?=[A-Z])/).join(' ');
            // capitalize first letter.
            return words.charAt(0).toUpperCase() + words.slice(1);
        };
        ValidationMessageProvider.inject = [validation_parser_1.ValidationParser];
        return ValidationMessageProvider;
    }());
    exports.ValidationMessageProvider = ValidationMessageProvider;
});

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define('aurelia-validation/implementation/validation-parser',["require", "exports", 'aurelia-binding', 'aurelia-templating', './util', 'aurelia-logging'], function (require, exports, aurelia_binding_1, aurelia_templating_1, util_1, LogManager) {
    "use strict";
    var ValidationParser = (function () {
        function ValidationParser(parser, bindinqLanguage) {
            this.parser = parser;
            this.bindinqLanguage = bindinqLanguage;
            this.emptyStringExpression = new aurelia_binding_1.LiteralString('');
            this.nullExpression = new aurelia_binding_1.LiteralPrimitive(null);
            this.undefinedExpression = new aurelia_binding_1.LiteralPrimitive(undefined);
            this.cache = {};
        }
        ValidationParser.prototype.coalesce = function (part) {
            // part === null || part === undefined ? '' : part
            return new aurelia_binding_1.Conditional(new aurelia_binding_1.Binary('||', new aurelia_binding_1.Binary('===', part, this.nullExpression), new aurelia_binding_1.Binary('===', part, this.undefinedExpression)), this.emptyStringExpression, new aurelia_binding_1.CallMember(part, 'toString', []));
        };
        ValidationParser.prototype.parseMessage = function (message) {
            if (this.cache[message] !== undefined) {
                return this.cache[message];
            }
            var parts = this.bindinqLanguage.parseInterpolation(null, message);
            if (parts === null) {
                return new aurelia_binding_1.LiteralString(message);
            }
            var expression = new aurelia_binding_1.LiteralString(parts[0]);
            for (var i = 1; i < parts.length; i += 2) {
                expression = new aurelia_binding_1.Binary('+', expression, new aurelia_binding_1.Binary('+', this.coalesce(parts[i]), new aurelia_binding_1.LiteralString(parts[i + 1])));
            }
            MessageExpressionValidator.validate(expression, message);
            this.cache[message] = expression;
            return expression;
        };
        ValidationParser.prototype.getAccessorExpression = function (fn) {
            var classic = /^function\s*\([$_\w\d]+\)\s*\{\s*(?:"use strict";)?\s*return\s+[$_\w\d]+\.([$_\w\d]+)\s*;?\s*\}$/;
            var arrow = /^[$_\w\d]+\s*=>\s*[$_\w\d]+\.([$_\w\d]+)$/;
            var match = classic.exec(fn) || arrow.exec(fn);
            if (match === null) {
                throw new Error("Unable to parse accessor function:\n" + fn);
            }
            return this.parser.parse(match[1]);
        };
        ValidationParser.prototype.parseProperty = function (property) {
            if (util_1.isString(property)) {
                return { name: property, displayName: null };
            }
            var accessor = this.getAccessorExpression(property.toString());
            if (accessor instanceof aurelia_binding_1.AccessScope
                || accessor instanceof aurelia_binding_1.AccessMember && accessor.object instanceof aurelia_binding_1.AccessScope) {
                return {
                    name: accessor.name,
                    displayName: null
                };
            }
            throw new Error("Invalid subject: \"" + accessor + "\"");
        };
        ValidationParser.inject = [aurelia_binding_1.Parser, aurelia_templating_1.BindingLanguage];
        return ValidationParser;
    }());
    exports.ValidationParser = ValidationParser;
    var MessageExpressionValidator = (function (_super) {
        __extends(MessageExpressionValidator, _super);
        function MessageExpressionValidator(originalMessage) {
            _super.call(this, []);
            this.originalMessage = originalMessage;
        }
        MessageExpressionValidator.validate = function (expression, originalMessage) {
            var visitor = new MessageExpressionValidator(originalMessage);
            expression.accept(visitor);
        };
        MessageExpressionValidator.prototype.visitAccessScope = function (access) {
            if (access.ancestor !== 0) {
                throw new Error('$parent is not permitted in validation message expressions.');
            }
            if (['displayName', 'propertyName', 'value', 'object', 'config', 'getDisplayName'].indexOf(access.name) !== -1) {
                LogManager.getLogger('aurelia-validation')
                    .warn("Did you mean to use \"$" + access.name + "\" instead of \"" + access.name + "\" in this validation message template: \"" + this.originalMessage + "\"?");
            }
        };
        return MessageExpressionValidator;
    }(aurelia_binding_1.Unparser));
    exports.MessageExpressionValidator = MessageExpressionValidator;
});

define('aurelia-validation/implementation/util',["require", "exports"], function (require, exports) {
    "use strict";
    function isString(value) {
        return Object.prototype.toString.call(value) === '[object String]';
    }
    exports.isString = isString;
});

define('aurelia-validation/implementation/validation-rules',["require", "exports", './util', './rules', './validation-messages'], function (require, exports, util_1, rules_1, validation_messages_1) {
    "use strict";
    /**
     * Part of the fluent rule API. Enables customizing property rules.
     */
    var FluentRuleCustomizer = (function () {
        function FluentRuleCustomizer(property, condition, config, fluentEnsure, fluentRules, parser) {
            if (config === void 0) { config = {}; }
            this.fluentEnsure = fluentEnsure;
            this.fluentRules = fluentRules;
            this.parser = parser;
            this.rule = {
                property: property,
                condition: condition,
                config: config,
                when: null,
                messageKey: 'default',
                message: null,
                sequence: fluentEnsure._sequence
            };
            this.fluentEnsure._addRule(this.rule);
        }
        /**
         * Validate subsequent rules after previously declared rules have
         * been validated successfully. Use to postpone validation of costly
         * rules until less expensive rules pass validation.
         */
        FluentRuleCustomizer.prototype.then = function () {
            this.fluentEnsure._sequence++;
            return this;
        };
        /**
         * Specifies the key to use when looking up the rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessageKey = function (key) {
            this.rule.messageKey = key;
            this.rule.message = null;
            return this;
        };
        /**
         * Specifies rule's validation message.
         */
        FluentRuleCustomizer.prototype.withMessage = function (message) {
            this.rule.messageKey = 'custom';
            this.rule.message = this.parser.parseMessage(message);
            return this;
        };
        /**
         * Specifies a condition that must be met before attempting to validate the rule.
         * @param condition A function that accepts the object as a parameter and returns true
         * or false whether the rule should be evaluated.
         */
        FluentRuleCustomizer.prototype.when = function (condition) {
            this.rule.when = condition;
            return this;
        };
        /**
         * Tags the rule instance, enabling the rule to be found easily
         * using ValidationRules.taggedRules(rules, tag)
         */
        FluentRuleCustomizer.prototype.tag = function (tag) {
            this.rule.tag = tag;
            return this;
        };
        ///// FluentEnsure APIs /////
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentRuleCustomizer.prototype.ensure = function (subject) {
            return this.fluentEnsure.ensure(subject);
        };
        /**
         * Targets an object with validation rules.
         */
        FluentRuleCustomizer.prototype.ensureObject = function () {
            return this.fluentEnsure.ensureObject();
        };
        Object.defineProperty(FluentRuleCustomizer.prototype, "rules", {
            /**
             * Rules that have been defined using the fluent API.
             */
            get: function () {
                return this.fluentEnsure.rules;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentRuleCustomizer.prototype.on = function (target) {
            return this.fluentEnsure.on(target);
        };
        ///////// FluentRules APIs /////////
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRuleCustomizer.prototype.satisfies = function (condition, config) {
            return this.fluentRules.satisfies(condition, config);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRuleCustomizer.prototype.satisfiesRule = function (name) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            return (_a = this.fluentRules).satisfiesRule.apply(_a, [name].concat(args));
            var _a;
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRuleCustomizer.prototype.required = function () {
            return this.fluentRules.required();
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.matches = function (regex) {
            return this.fluentRules.matches(regex);
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.email = function () {
            return this.fluentRules.email();
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.minLength = function (length) {
            return this.fluentRules.minLength(length);
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxLength = function (length) {
            return this.fluentRules.maxLength(length);
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.minItems = function (count) {
            return this.fluentRules.minItems(count);
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRuleCustomizer.prototype.maxItems = function (count) {
            return this.fluentRules.maxItems(count);
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRuleCustomizer.prototype.equals = function (expectedValue) {
            return this.fluentRules.equals(expectedValue);
        };
        return FluentRuleCustomizer;
    }());
    exports.FluentRuleCustomizer = FluentRuleCustomizer;
    /**
     * Part of the fluent rule API. Enables applying rules to properties and objects.
     */
    var FluentRules = (function () {
        function FluentRules(fluentEnsure, parser, property) {
            this.fluentEnsure = fluentEnsure;
            this.parser = parser;
            this.property = property;
        }
        /**
         * Sets the display name of the ensured property.
         */
        FluentRules.prototype.displayName = function (name) {
            this.property.displayName = name;
            return this;
        };
        /**
         * Applies an ad-hoc rule function to the ensured property or object.
         * @param condition The function to validate the rule.
         * Will be called with two arguments, the property value and the object.
         * Should return a boolean or a Promise that resolves to a boolean.
         */
        FluentRules.prototype.satisfies = function (condition, config) {
            return new FluentRuleCustomizer(this.property, condition, config, this.fluentEnsure, this, this.parser);
        };
        /**
         * Applies a rule by name.
         * @param name The name of the custom or standard rule.
         * @param args The rule's arguments.
         */
        FluentRules.prototype.satisfiesRule = function (name) {
            var _this = this;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var rule = FluentRules.customRules[name];
            if (!rule) {
                // standard rule?
                rule = this[name];
                if (rule instanceof Function) {
                    return rule.call.apply(rule, [this].concat(args));
                }
                throw new Error("Rule with name \"" + name + "\" does not exist.");
            }
            var config = rule.argsToConfig ? rule.argsToConfig.apply(rule, args) : undefined;
            return this.satisfies(function (value, obj) { return (_a = rule.condition).call.apply(_a, [_this, value, obj].concat(args)); var _a; }, config)
                .withMessageKey(name);
        };
        /**
         * Applies the "required" rule to the property.
         * The value cannot be null, undefined or whitespace.
         */
        FluentRules.prototype.required = function () {
            return this.satisfies(function (value) {
                return value !== null
                    && value !== undefined
                    && !(util_1.isString(value) && !/\S/.test(value));
            }).withMessageKey('required');
        };
        /**
         * Applies the "matches" rule to the property.
         * Value must match the specified regular expression.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.matches = function (regex) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || regex.test(value); })
                .withMessageKey('matches');
        };
        /**
         * Applies the "email" rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.email = function () {
            return this.matches(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i)
                .withMessageKey('email');
        };
        /**
         * Applies the "minLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.minLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length >= length; }, { length: length })
                .withMessageKey('minLength');
        };
        /**
         * Applies the "maxLength" STRING validation rule to the property.
         * null, undefined and empty-string values are considered valid.
         */
        FluentRules.prototype.maxLength = function (length) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length === 0 || value.length <= length; }, { length: length })
                .withMessageKey('maxLength');
        };
        /**
         * Applies the "minItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.minItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length >= count; }, { count: count })
                .withMessageKey('minItems');
        };
        /**
         * Applies the "maxItems" ARRAY validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.maxItems = function (count) {
            return this.satisfies(function (value) { return value === null || value === undefined || value.length <= count; }, { count: count })
                .withMessageKey('maxItems');
        };
        /**
         * Applies the "equals" validation rule to the property.
         * null and undefined values are considered valid.
         */
        FluentRules.prototype.equals = function (expectedValue) {
            return this.satisfies(function (value) { return value === null || value === undefined || value === '' || value === expectedValue; }, { expectedValue: expectedValue })
                .withMessageKey('equals');
        };
        FluentRules.customRules = {};
        return FluentRules;
    }());
    exports.FluentRules = FluentRules;
    /**
     * Part of the fluent rule API. Enables targeting properties and objects with rules.
     */
    var FluentEnsure = (function () {
        function FluentEnsure(parser) {
            this.parser = parser;
            /**
             * Rules that have been defined using the fluent API.
             */
            this.rules = [];
            this._sequence = 0;
        }
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        FluentEnsure.prototype.ensure = function (property) {
            this.assertInitialized();
            return new FluentRules(this, this.parser, this.parser.parseProperty(property));
        };
        /**
         * Targets an object with validation rules.
         */
        FluentEnsure.prototype.ensureObject = function () {
            this.assertInitialized();
            return new FluentRules(this, this.parser, { name: null, displayName: null });
        };
        /**
         * Applies the rules to a class or object, making them discoverable by the StandardValidator.
         * @param target A class or object.
         */
        FluentEnsure.prototype.on = function (target) {
            rules_1.Rules.set(target, this.rules);
            return this;
        };
        /**
         * Adds a rule definition to the sequenced ruleset.
         */
        FluentEnsure.prototype._addRule = function (rule) {
            while (this.rules.length < rule.sequence + 1) {
                this.rules.push([]);
            }
            this.rules[rule.sequence].push(rule);
        };
        FluentEnsure.prototype.assertInitialized = function () {
            if (this.parser) {
                return;
            }
            throw new Error("Did you forget to add \".plugin('aurelia-validation)\" to your main.js?");
        };
        return FluentEnsure;
    }());
    exports.FluentEnsure = FluentEnsure;
    /**
     * Fluent rule definition API.
     */
    var ValidationRules = (function () {
        function ValidationRules() {
        }
        ValidationRules.initialize = function (parser) {
            ValidationRules.parser = parser;
        };
        /**
         * Target a property with validation rules.
         * @param property The property to target. Can be the property name or a property accessor function.
         */
        ValidationRules.ensure = function (property) {
            return new FluentEnsure(ValidationRules.parser).ensure(property);
        };
        /**
         * Targets an object with validation rules.
         */
        ValidationRules.ensureObject = function () {
            return new FluentEnsure(ValidationRules.parser).ensureObject();
        };
        /**
         * Defines a custom rule.
         * @param name The name of the custom rule. Also serves as the message key.
         * @param condition The rule function.
         * @param message The message expression
         * @param argsToConfig A function that maps the rule's arguments to a "config" object that can be used when evaluating the message expression.
         */
        ValidationRules.customRule = function (name, condition, message, argsToConfig) {
            validation_messages_1.validationMessages[name] = message;
            FluentRules.customRules[name] = { condition: condition, argsToConfig: argsToConfig };
        };
        /**
         * Returns rules with the matching tag.
         * @param rules The rules to search.
         * @param tag The tag to search for.
         */
        ValidationRules.taggedRules = function (rules, tag) {
            return rules.map(function (x) { return x.filter(function (r) { return r.tag === tag; }); });
        };
        /**
         * Removes the rules from a class or object.
         * @param target A class or object.
         */
        ValidationRules.off = function (target) {
            rules_1.Rules.unset(target);
        };
        return ValidationRules;
    }());
    exports.ValidationRules = ValidationRules;
});

define('aurelia-materialize-bridge/exports',['exports', './autocomplete/autocomplete', './badge/badge', './box/box', './breadcrumbs/breadcrumbs', './breadcrumbs/instructionFilter', './button/button', './card/card', './carousel/carousel-item', './carousel/carousel', './char-counter/char-counter', './checkbox/checkbox', './chip/chip', './chip/chips', './collapsible/collapsible', './collection/collection-header', './collection/collection-item', './collection/collection', './collection/md-collection-selector', './colors/colorValueConverters', './colors/md-colors', './common/attributeManager', './common/attributes', './common/constants', './common/events', './datepicker/datepicker-default-parser', './datepicker/datepicker', './dropdown/dropdown-element', './dropdown/dropdown', './dropdown/dropdown-fix', './fab/fab', './file/file', './footer/footer', './input/input-prefix', './input/input-update-service', './input/input', './modal/modal', './modal/modal-trigger', './navbar/navbar', './pagination/pagination', './parallax/parallax', './progress/progress', './pushpin/pushpin', './radio/radio', './range/range', './scrollfire/scrollfire-patch', './scrollfire/scrollfire-target', './scrollfire/scrollfire', './scrollspy/scrollspy', './select/select', './sidenav/sidenav-collapse', './sidenav/sidenav', './slider/slider', './switch/switch', './tabs/tabs', './toast/toastService', './tooltip/tooltip', './transitions/fadein-image', './transitions/staggered-list', './validation/validationRenderer', './waves/waves'], function (exports, _autocomplete, _badge, _box, _breadcrumbs, _instructionFilter, _button, _card, _carouselItem, _carousel, _charCounter, _checkbox, _chip, _chips, _collapsible, _collectionHeader, _collectionItem, _collection, _mdCollectionSelector, _colorValueConverters, _mdColors, _attributeManager, _attributes, _constants, _events, _datepickerDefaultParser, _datepicker, _dropdownElement, _dropdown, _dropdownFix, _fab, _file, _footer, _inputPrefix, _inputUpdateService, _input, _modal, _modalTrigger, _navbar, _pagination, _parallax, _progress, _pushpin, _radio, _range, _scrollfirePatch, _scrollfireTarget, _scrollfire, _scrollspy, _select, _sidenavCollapse, _sidenav, _slider, _switch, _tabs, _toastService, _tooltip, _fadeinImage, _staggeredList, _validationRenderer, _waves) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_autocomplete).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _autocomplete[key];
      }
    });
  });
  Object.keys(_badge).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _badge[key];
      }
    });
  });
  Object.keys(_box).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _box[key];
      }
    });
  });
  Object.keys(_breadcrumbs).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _breadcrumbs[key];
      }
    });
  });
  Object.keys(_instructionFilter).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _instructionFilter[key];
      }
    });
  });
  Object.keys(_button).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _button[key];
      }
    });
  });
  Object.keys(_card).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _card[key];
      }
    });
  });
  Object.keys(_carouselItem).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _carouselItem[key];
      }
    });
  });
  Object.keys(_carousel).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _carousel[key];
      }
    });
  });
  Object.keys(_charCounter).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _charCounter[key];
      }
    });
  });
  Object.keys(_checkbox).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _checkbox[key];
      }
    });
  });
  Object.keys(_chip).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _chip[key];
      }
    });
  });
  Object.keys(_chips).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _chips[key];
      }
    });
  });
  Object.keys(_collapsible).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _collapsible[key];
      }
    });
  });
  Object.keys(_collectionHeader).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _collectionHeader[key];
      }
    });
  });
  Object.keys(_collectionItem).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _collectionItem[key];
      }
    });
  });
  Object.keys(_collection).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _collection[key];
      }
    });
  });
  Object.keys(_mdCollectionSelector).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _mdCollectionSelector[key];
      }
    });
  });
  Object.keys(_colorValueConverters).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _colorValueConverters[key];
      }
    });
  });
  Object.keys(_mdColors).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _mdColors[key];
      }
    });
  });
  Object.keys(_attributeManager).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _attributeManager[key];
      }
    });
  });
  Object.keys(_attributes).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _attributes[key];
      }
    });
  });
  Object.keys(_constants).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _constants[key];
      }
    });
  });
  Object.keys(_events).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _events[key];
      }
    });
  });
  Object.keys(_datepickerDefaultParser).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _datepickerDefaultParser[key];
      }
    });
  });
  Object.keys(_datepicker).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _datepicker[key];
      }
    });
  });
  Object.keys(_dropdownElement).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _dropdownElement[key];
      }
    });
  });
  Object.keys(_dropdown).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _dropdown[key];
      }
    });
  });
  Object.keys(_dropdownFix).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _dropdownFix[key];
      }
    });
  });
  Object.keys(_fab).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _fab[key];
      }
    });
  });
  Object.keys(_file).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _file[key];
      }
    });
  });
  Object.keys(_footer).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _footer[key];
      }
    });
  });
  Object.keys(_inputPrefix).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _inputPrefix[key];
      }
    });
  });
  Object.keys(_inputUpdateService).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _inputUpdateService[key];
      }
    });
  });
  Object.keys(_input).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _input[key];
      }
    });
  });
  Object.keys(_modal).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _modal[key];
      }
    });
  });
  Object.keys(_modalTrigger).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _modalTrigger[key];
      }
    });
  });
  Object.keys(_navbar).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _navbar[key];
      }
    });
  });
  Object.keys(_pagination).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _pagination[key];
      }
    });
  });
  Object.keys(_parallax).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _parallax[key];
      }
    });
  });
  Object.keys(_progress).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _progress[key];
      }
    });
  });
  Object.keys(_pushpin).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _pushpin[key];
      }
    });
  });
  Object.keys(_radio).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _radio[key];
      }
    });
  });
  Object.keys(_range).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _range[key];
      }
    });
  });
  Object.keys(_scrollfirePatch).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _scrollfirePatch[key];
      }
    });
  });
  Object.keys(_scrollfireTarget).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _scrollfireTarget[key];
      }
    });
  });
  Object.keys(_scrollfire).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _scrollfire[key];
      }
    });
  });
  Object.keys(_scrollspy).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _scrollspy[key];
      }
    });
  });
  Object.keys(_select).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _select[key];
      }
    });
  });
  Object.keys(_sidenavCollapse).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _sidenavCollapse[key];
      }
    });
  });
  Object.keys(_sidenav).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _sidenav[key];
      }
    });
  });
  Object.keys(_slider).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _slider[key];
      }
    });
  });
  Object.keys(_switch).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _switch[key];
      }
    });
  });
  Object.keys(_tabs).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _tabs[key];
      }
    });
  });
  Object.keys(_toastService).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _toastService[key];
      }
    });
  });
  Object.keys(_tooltip).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _tooltip[key];
      }
    });
  });
  Object.keys(_fadeinImage).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _fadeinImage[key];
      }
    });
  });
  Object.keys(_staggeredList).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _staggeredList[key];
      }
    });
  });
  Object.keys(_validationRenderer).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _validationRenderer[key];
      }
    });
  });
  Object.keys(_waves).forEach(function (key) {
    if (key === "default") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _waves[key];
      }
    });
  });
});
define('aurelia-materialize-bridge/autocomplete/autocomplete',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/events'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdAutoComplete = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdAutoComplete = exports.MdAutoComplete = (_dec = (0, _aureliaTemplating.customAttribute)('md-autocomplete'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdAutoComplete(element) {
      _classCallCheck(this, MdAutoComplete);

      this.input = null;

      _initDefineProp(this, 'values', _descriptor, this);

      this.element = element;
    }

    MdAutoComplete.prototype.attached = function attached() {
      if (this.element.tagName.toLowerCase() === 'input') {
        this.input = this.element;
      } else if (this.element.tagName.toLowerCase() === 'md-input') {
        this.input = this.element.au.controller.viewModel.input;
      } else {
        throw new Error('md-autocomplete must be attached to either an input or md-input element');
      }
      this.refresh();
    };

    MdAutoComplete.prototype.detached = function detached() {
      $(this.input).siblings('.autocomplete-content').off('click');
      $(this.input).siblings('.autocomplete-content').remove();
    };

    MdAutoComplete.prototype.refresh = function refresh() {
      var _this = this;

      this.detached();
      $(this.input).autocomplete({
        data: this.values
      });

      $(this.input).siblings('.autocomplete-content').on('click', function () {
        (0, _events.fireEvent)(_this.input, 'change');
      });
    };

    MdAutoComplete.prototype.valuesChanged = function valuesChanged(newValue) {
      this.refresh();
    };

    return MdAutoComplete;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'values', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return {};
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/common/events',['exports', './constants'], function (exports, _constants) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.fireEvent = fireEvent;
  exports.fireMaterializeEvent = fireMaterializeEvent;
  function fireEvent(element, name) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    var event = new CustomEvent(name, {
      detail: data,
      bubbles: true
    });
    element.dispatchEvent(event);

    return event;
  }

  function fireMaterializeEvent(element, name) {
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    return fireEvent(element, '' + _constants.constants.eventPrefix + name, data);
  }
});
define('aurelia-materialize-bridge/common/constants',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var constants = exports.constants = {
    eventPrefix: 'md-on-',
    bindablePrefix: 'md-'
  };
});
define('aurelia-materialize-bridge/badge/badge',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributeManager, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdBadge = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdBadge = exports.MdBadge = (_dec = (0, _aureliaTemplating.customAttribute)('md-badge'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdBadge(element) {
      _classCallCheck(this, MdBadge);

      _initDefineProp(this, 'isNew', _descriptor, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdBadge.prototype.attached = function attached() {
      var classes = ['badge'];
      if ((0, _attributes.getBooleanFromAttributeValue)(this.isNew)) {
        classes.push('new');
      }
      this.attributeManager.addClasses(classes);
    };

    MdBadge.prototype.detached = function detached() {
      this.attributeManager.removeClasses(['badge', 'new']);
    };

    return MdBadge;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'isNew', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/common/attributeManager',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var AttributeManager = exports.AttributeManager = function () {
    function AttributeManager(element) {
      _classCallCheck(this, AttributeManager);

      this._colorClasses = ['accent', 'primary'];
      this.addedClasses = [];
      this.addedAttributes = {};

      this.element = element;
    }

    AttributeManager.prototype.addAttributes = function addAttributes(attrs) {
      var _this = this;

      var keys = Object.keys(attrs);
      keys.forEach(function (k) {
        if (!_this.element.getAttribute(k)) {
          _this.addedAttributes[k] = attrs[k];
          _this.element.setAttribute(k, attrs[k]);
        } else if (_this.element.getAttribute(k) !== attrs[k]) {
          _this.element.setAttribute(k, attrs[k]);
        }
      });
    };

    AttributeManager.prototype.removeAttributes = function removeAttributes(attrs) {
      var _this2 = this;

      if (typeof attrs === 'string') {
        attrs = [attrs];
      }
      attrs.forEach(function (a) {
        if (_this2.element.getAttribute(a) && !!_this2.addedAttributes[a]) {
          _this2.element.removeAttribute(a);
          _this2.addedAttributes[a] = null;
          delete _this2.addedAttributes[a];
        }
      });
    };

    AttributeManager.prototype.addClasses = function addClasses(classes) {
      var _this3 = this;

      if (typeof classes === 'string') {
        classes = [classes];
      }
      classes.forEach(function (c) {
        var classListHasColor = _this3._colorClasses.filter(function (cc) {
          return _this3.element.classList.contains(cc);
        }).length > 0;
        if (_this3._colorClasses.indexOf(c) > -1 && classListHasColor) {} else {
            if (!_this3.element.classList.contains(c)) {
              _this3.addedClasses.push(c);
              _this3.element.classList.add(c);
            }
          }
      });
    };

    AttributeManager.prototype.removeClasses = function removeClasses(classes) {
      var _this4 = this;

      if (typeof classes === 'string') {
        classes = [classes];
      }
      classes.forEach(function (c) {
        if (_this4.element.classList.contains(c) && _this4.addedClasses.indexOf(c) > -1) {
          _this4.element.classList.remove(c);
          _this4.addedClasses.splice(_this4.addedClasses.indexOf(c), 1);
        }
      });
    };

    return AttributeManager;
  }();
});
define('aurelia-materialize-bridge/common/attributes',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getBooleanFromAttributeValue = getBooleanFromAttributeValue;
  function getBooleanFromAttributeValue(value) {
    return value === true || value === 'true';
  }
});
define('aurelia-materialize-bridge/box/box',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdBox = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdBox = exports.MdBox = (_dec = (0, _aureliaTemplating.customAttribute)('md-box'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdBox(element) {
      _classCallCheck(this, MdBox);

      _initDefineProp(this, 'caption', _descriptor, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdBox.prototype.attached = function attached() {
      this.attributeManager.addClasses('materialboxed');
      if (this.caption) {
        this.attributeManager.addAttributes({ 'data-caption': this.caption });
      }

      $(this.element).materialbox();
    };

    MdBox.prototype.detached = function detached() {
      this.attributeManager.removeAttributes('data-caption');
      this.attributeManager.removeClasses('materialboxed');
    };

    return MdBox;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'caption', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/breadcrumbs/breadcrumbs',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-router'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdBreadcrumbs = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdBreadcrumbs = exports.MdBreadcrumbs = (_dec = (0, _aureliaTemplating.customElement)('md-breadcrumbs'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaRouter.Router), _dec(_class = _dec2(_class = function () {
    function MdBreadcrumbs(element, router) {
      _classCallCheck(this, MdBreadcrumbs);

      this.element = element;
      this._childRouter = router;
      while (router.parent) {
        router = router.parent;
      }
      this.router = router;
    }

    MdBreadcrumbs.prototype.navigate = function navigate(navigationInstruction) {
      this._childRouter.navigateToRoute(navigationInstruction.config.name);
    };

    return MdBreadcrumbs;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/breadcrumbs/instructionFilter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var InstructionFilterValueConverter = exports.InstructionFilterValueConverter = function () {
    function InstructionFilterValueConverter() {
      _classCallCheck(this, InstructionFilterValueConverter);
    }

    InstructionFilterValueConverter.prototype.toView = function toView(navigationInstructions) {
      return navigationInstructions.filter(function (i) {
        var result = false;
        if (i.config.title) {
          result = true;
        }
        return result;
      });
    };

    return InstructionFilterValueConverter;
  }();
});
define('aurelia-materialize-bridge/button/button',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributeManager, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdButton = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var MdButton = exports.MdButton = (_dec = (0, _aureliaTemplating.customAttribute)('md-button'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec6 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdButton(element) {
      _classCallCheck(this, MdButton);

      _initDefineProp(this, 'disabled', _descriptor, this);

      _initDefineProp(this, 'flat', _descriptor2, this);

      _initDefineProp(this, 'floating', _descriptor3, this);

      _initDefineProp(this, 'large', _descriptor4, this);

      this.attributeManager = new _attributeManager.AttributeManager(element);
    }

    MdButton.prototype.attached = function attached() {
      var classes = [];

      if ((0, _attributes.getBooleanFromAttributeValue)(this.flat)) {
        classes.push('btn-flat');
      }
      if ((0, _attributes.getBooleanFromAttributeValue)(this.floating)) {
        classes.push('btn-floating');
      }
      if ((0, _attributes.getBooleanFromAttributeValue)(this.large)) {
        classes.push('btn-large');
      }

      if (classes.length === 0) {
        classes.push('btn');
      }

      if ((0, _attributes.getBooleanFromAttributeValue)(this.disabled)) {
        classes.push('disabled');
      }

      if (!(0, _attributes.getBooleanFromAttributeValue)(this.flat)) {
        classes.push('accent');
      }
      this.attributeManager.addClasses(classes);
    };

    MdButton.prototype.detached = function detached() {
      this.attributeManager.removeClasses(['accent', 'btn', 'btn-flat', 'btn-large', 'disabled']);
    };

    MdButton.prototype.disabledChanged = function disabledChanged(newValue) {
      if ((0, _attributes.getBooleanFromAttributeValue)(newValue)) {
        this.attributeManager.addClasses('disabled');
      } else {
        this.attributeManager.removeClasses('disabled');
      }
    };

    MdButton.prototype.flatChanged = function flatChanged(newValue) {
      if ((0, _attributes.getBooleanFromAttributeValue)(newValue)) {
        this.attributeManager.removeClasses(['btn', 'accent']);
        this.attributeManager.addClasses('btn-flat');
      } else {
        this.attributeManager.removeClasses('btn-flat');
        this.attributeManager.addClasses(['btn', 'accent']);
      }
    };

    return MdButton;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'disabled', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'flat', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'floating', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'large', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/card/card',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-binding', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaBinding, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCard = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var MdCard = exports.MdCard = (_dec = (0, _aureliaTemplating.customElement)('md-card'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneWay
  }), _dec7 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdCard(element) {
      _classCallCheck(this, MdCard);

      _initDefineProp(this, 'mdHorizontal', _descriptor, this);

      _initDefineProp(this, 'mdImage', _descriptor2, this);

      _initDefineProp(this, 'mdReveal', _descriptor3, this);

      _initDefineProp(this, 'mdSize', _descriptor4, this);

      _initDefineProp(this, 'mdTitle', _descriptor5, this);

      this.element = element;
    }

    MdCard.prototype.attached = function attached() {
      this.mdHorizontal = (0, _attributes.getBooleanFromAttributeValue)(this.mdHorizontal);
      this.mdReveal = (0, _attributes.getBooleanFromAttributeValue)(this.mdReveal);
    };

    return MdCard;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdHorizontal', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdImage', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdReveal', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdSize', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mdTitle', [_dec7], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/carousel/carousel-item',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCarouselItem = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var MdCarouselItem = exports.MdCarouselItem = (_dec = (0, _aureliaTemplating.customElement)('md-carousel-item'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneWay
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdCarouselItem(element) {
      _classCallCheck(this, MdCarouselItem);

      _initDefineProp(this, 'mdHref', _descriptor, this);

      _initDefineProp(this, 'mdImage', _descriptor2, this);

      this.element = element;
    }

    MdCarouselItem.prototype.attached = function attached() {};

    return MdCarouselItem;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdHref', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdImage', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/carousel/carousel',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCarousel = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdCarousel = exports.MdCarousel = (_dec = (0, _aureliaTemplating.customElement)('md-carousel'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaTaskQueue.TaskQueue), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.children)('md-carousel-item'), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdCarousel(element, taskQueue) {
      _classCallCheck(this, MdCarousel);

      _initDefineProp(this, 'mdIndicators', _descriptor, this);

      _initDefineProp(this, 'mdSlider', _descriptor2, this);

      _initDefineProp(this, 'items', _descriptor3, this);

      this.element = element;
      this.taskQueue = taskQueue;
    }

    MdCarousel.prototype.attached = function attached() {
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdSlider)) {
        this.element.classList.add('carousel-slider');
      }

      this.refresh();
    };

    MdCarousel.prototype.itemsChanged = function itemsChanged(newValue) {
      this.refresh();
    };

    MdCarousel.prototype.refresh = function refresh() {
      var _this = this;

      if (this.items.length > 0) {
        (function () {
          var options = {
            full_width: (0, _attributes.getBooleanFromAttributeValue)(_this.mdSlider),
            indicators: _this.mdIndicators
          };

          _this.taskQueue.queueTask(function () {
            $(_this.element).carousel(options);
          });
        })();
      }
    };

    return MdCarousel;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdIndicators', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdSlider', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'items', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/char-counter/char-counter',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCharCounter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdCharCounter = exports.MdCharCounter = (_dec = (0, _aureliaTemplating.customAttribute)('md-char-counter'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdCharCounter(element) {
      _classCallCheck(this, MdCharCounter);

      _initDefineProp(this, 'length', _descriptor, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdCharCounter.prototype.attached = function attached() {
      var _this = this;

      this.length = parseInt(this.length, 10);

      if (this.element.tagName.toUpperCase() === 'INPUT') {
        this.attributeManager.addAttributes({ 'length': this.length });
        $(this.element).characterCounter();
      } else {
        $(this.element).find('input').each(function (i, el) {
          $(el).attr('length', _this.length);
        });
        $(this.element).find('input').characterCounter();
      }
    };

    MdCharCounter.prototype.detached = function detached() {
      this.attributeManager.removeAttributes(['length']);
    };

    return MdCharCounter;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'length', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return 120;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/checkbox/checkbox',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes', '../common/events'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributeManager, _attributes, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCheckbox = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  var MdCheckbox = exports.MdCheckbox = (_dec = (0, _aureliaTemplating.customElement)('md-checkbox'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function MdCheckbox(element) {
      _classCallCheck(this, MdCheckbox);

      _initDefineProp(this, 'mdChecked', _descriptor, this);

      _initDefineProp(this, 'mdDisabled', _descriptor2, this);

      _initDefineProp(this, 'mdFilledIn', _descriptor3, this);

      this.element = element;
      this.controlId = 'md-checkbox-' + MdCheckbox.id++;
      this.handleChange = this.handleChange.bind(this);
    }

    MdCheckbox.prototype.attached = function attached() {
      this.attributeManager = new _attributeManager.AttributeManager(this.checkbox);
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdFilledIn)) {
        this.attributeManager.addClasses('filled-in');
      }
      if (this.mdChecked === null) {
        this.checkbox.indeterminate = true;
      } else {
        this.checkbox.indeterminate = false;
      }
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdDisabled)) {
        this.checkbox.disabled = true;
      }
      this.checkbox.checked = (0, _attributes.getBooleanFromAttributeValue)(this.mdChecked);
      this.checkbox.addEventListener('change', this.handleChange);
    };

    MdCheckbox.prototype.blur = function blur() {
      (0, _events.fireEvent)(this.element, 'blur');
    };

    MdCheckbox.prototype.detached = function detached() {
      this.attributeManager.removeClasses(['filled-in', 'disabled']);
      this.checkbox.removeEventListener('change', this.handleChange);
    };

    MdCheckbox.prototype.handleChange = function handleChange() {
      this.mdChecked = this.checkbox.checked;
      (0, _events.fireEvent)(this.element, 'blur');
    };

    MdCheckbox.prototype.mdCheckedChanged = function mdCheckedChanged(newValue) {
      if (this.checkbox) {
        this.checkbox.checked = !!newValue;
      }
    };

    MdCheckbox.prototype.mdDisabledChanged = function mdDisabledChanged(newValue) {
      if (this.checkbox) {
        this.checkbox.disabled = !!newValue;
      }
    };

    return MdCheckbox;
  }(), _class3.id = 0, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdChecked', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdDisabled', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdFilledIn', [_dec5], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/chip/chip',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdChip = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdChip = exports.MdChip = (_dec = (0, _aureliaTemplating.customElement)('md-chip'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdChip(element) {
      _classCallCheck(this, MdChip);

      _initDefineProp(this, 'mdClose', _descriptor, this);

      this.element = element;
    }

    MdChip.prototype.attached = function attached() {
      this.mdClose = (0, _attributes.getBooleanFromAttributeValue)(this.mdClose);
    };

    MdChip.prototype.close = function close() {
      this.element.parentElement.removeChild(this.element);
    };

    return MdChip;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdClose', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/chip/chips',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdChips = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdChips = exports.MdChips = (_dec = (0, _aureliaTemplating.customAttribute)('md-chips'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdChips(element) {
      _classCallCheck(this, MdChips);

      _initDefineProp(this, 'data', _descriptor, this);

      _initDefineProp(this, 'placeholder', _descriptor2, this);

      _initDefineProp(this, 'secondaryPlaceholder', _descriptor3, this);

      this.element = element;
      this.log = (0, _aureliaLogging.getLogger)('md-chips');

      this.onChipAdd = this.onChipAdd.bind(this);
      this.onChipDelete = this.onChipDelete.bind(this);
      this.onChipSelect = this.onChipSelect.bind(this);
    }

    MdChips.prototype.attached = function attached() {
      var options = {
        data: this.data,
        placeholder: this.placeholder,
        secondaryPlaceholder: this.secondaryPlaceholder
      };
      $(this.element).material_chip(options);
      $(this.element).on('chip.add', this.onChipAdd);
      $(this.element).on('chip.delete', this.onChipDelete);
      $(this.element).on('chip.select', this.onChipSelect);
    };

    MdChips.prototype.detached = function detached() {};

    MdChips.prototype.onChipAdd = function onChipAdd(e, chip) {};

    MdChips.prototype.onChipDelete = function onChipDelete(e, chip) {};

    MdChips.prototype.onChipSelect = function onChipSelect(e, chip) {};

    return MdChips;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'data', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'placeholder', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'secondaryPlaceholder', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/collapsible/collapsible',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributes', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributes, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCollapsible = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _dec3, _dec4, _class;

  var MdCollapsible = exports.MdCollapsible = (_dec = (0, _aureliaTemplating.customAttribute)('md-collapsible'), _dec2 = (0, _aureliaTemplating.bindable)({ name: 'accordion', defaultValue: false }), _dec3 = (0, _aureliaTemplating.bindable)({ name: 'popout', defaultValue: false }), _dec4 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = function () {
    function MdCollapsible(element) {
      _classCallCheck(this, MdCollapsible);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdCollapsible.prototype.attached = function attached() {
      this.attributeManager.addClasses('collapsible');
      if ((0, _attributes.getBooleanFromAttributeValue)(this.popout)) {
        this.attributeManager.addClasses('popout');
      }
      this.refresh();
    };

    MdCollapsible.prototype.detached = function detached() {
      this.attributeManager.removeClasses(['collapsible', 'popout']);
      this.attributeManager.removeAttributes(['data-collapsible']);
    };

    MdCollapsible.prototype.refresh = function refresh() {
      var accordion = (0, _attributes.getBooleanFromAttributeValue)(this.accordion);
      if (accordion) {
        this.attributeManager.addAttributes({ 'data-collapsible': 'accordion' });
      } else {
        this.attributeManager.addAttributes({ 'data-collapsible': 'expandable' });
      }

      $(this.element).collapsible({
        accordion: accordion
      });
    };

    MdCollapsible.prototype.accordionChanged = function accordionChanged() {
      this.refresh();
    };

    return MdCollapsible;
  }()) || _class) || _class) || _class) || _class);
});
define('aurelia-materialize-bridge/collection/collection-header',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCollectionHeader = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdCollectionHeader = exports.MdCollectionHeader = (_dec = (0, _aureliaTemplating.customElement)('md-collection-header'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function MdCollectionHeader(element) {
    _classCallCheck(this, MdCollectionHeader);

    this.element = element;
  }) || _class) || _class);
});
define('aurelia-materialize-bridge/collection/collection-item',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCollectionItem = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var MdCollectionItem = exports.MdCollectionItem = (_dec = (0, _aureliaTemplating.customElement)('md-collection-item'), _dec(_class = function MdCollectionItem() {
    _classCallCheck(this, MdCollectionItem);
  }) || _class);
});
define('aurelia-materialize-bridge/collection/collection',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdCollection = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdCollection = exports.MdCollection = (_dec = (0, _aureliaTemplating.customElement)('md-collection'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function MdCollection(element) {
      _classCallCheck(this, MdCollection);

      this.element = element;
    }

    MdCollection.prototype.attached = function attached() {
      var header = this.element.querySelector('md-collection-header');
      if (header) {
        this.anchor.classList.add('with-header');
      }
    };

    MdCollection.prototype.getSelected = function getSelected() {
      var items = [].slice.call(this.element.querySelectorAll('md-collection-selector'));
      return items.filter(function (i) {
        return i.au['md-collection-selector'].viewModel.isSelected;
      }).map(function (i) {
        return i.au['md-collection-selector'].viewModel.item;
      });
    };

    MdCollection.prototype.clearSelection = function clearSelection() {
      var items = [].slice.call(this.element.querySelectorAll('md-collection-selector'));
      items.forEach(function (i) {
        return i.au['md-collection-selector'].viewModel.isSelected = false;
      });
    };

    MdCollection.prototype.selectAll = function selectAll() {
      var items = [].slice.call(this.element.querySelectorAll('md-collection-selector'));
      items.forEach(function (i) {
        var vm = i.au['md-collection-selector'].viewModel;
        vm.isSelected = !vm.mdDisabled;
      });
    };

    return MdCollection;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/collection/md-collection-selector',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-binding', '../common/events', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaBinding, _events, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdlListSelector = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdlListSelector = exports.MdlListSelector = (_dec = (0, _aureliaTemplating.customElement)('md-collection-selector'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaBinding.observable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdlListSelector(element) {
      _classCallCheck(this, MdlListSelector);

      _initDefineProp(this, 'item', _descriptor, this);

      _initDefineProp(this, 'mdDisabled', _descriptor2, this);

      _initDefineProp(this, 'isSelected', _descriptor3, this);

      this.element = element;
    }

    MdlListSelector.prototype.isSelectedChanged = function isSelectedChanged(newValue) {
      (0, _events.fireMaterializeEvent)(this.element, 'selection-changed', { item: this.item, isSelected: this.isSelected });
    };

    MdlListSelector.prototype.mdDisabledChanged = function mdDisabledChanged(newValue) {
      this.mdDisabled = (0, _attributes.getBooleanFromAttributeValue)(newValue);
    };

    return MdlListSelector;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'item', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdDisabled', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'isSelected', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/colors/colorValueConverters',["exports"], function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function shadeBlendConvert(p, from, to) {
        if (typeof p != "number" || p < -1 || p > 1 || typeof from != "string" || from[0] != 'r' && from[0] != '#' || typeof to != "string" && typeof to != "undefined") return null;
        var sbcRip = function sbcRip(d) {
            var l = d.length,
                RGB = new Object();
            if (l > 9) {
                d = d.split(",");
                if (d.length < 3 || d.length > 4) return null;
                RGB[0] = i(d[0].slice(4)), RGB[1] = i(d[1]), RGB[2] = i(d[2]), RGB[3] = d[3] ? parseFloat(d[3]) : -1;
            } else {
                switch (l) {case 8:case 6:case 3:case 2:case 1:
                        return null;}
                if (l < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (l > 4 ? d[4] + "" + d[4] : "");
                d = i(d.slice(1), 16), RGB[0] = d >> 16 & 255, RGB[1] = d >> 8 & 255, RGB[2] = d & 255, RGB[3] = l == 9 || l == 5 ? r((d >> 24 & 255) / 255 * 10000) / 10000 : -1;
            }
            return RGB;
        };
        var i = parseInt,
            r = Math.round,
            h = from.length > 9,
            h = typeof to == "string" ? to.length > 9 ? true : to == "c" ? !h : false : h,
            b = p < 0,
            p = b ? p * -1 : p,
            to = to && to != "c" ? to : b ? "#000000" : "#FFFFFF",
            f = sbcRip(from),
            t = sbcRip(to);
        if (!f || !t) return null;
        if (h) return "rgb(" + r((t[0] - f[0]) * p + f[0]) + "," + r((t[1] - f[1]) * p + f[1]) + "," + r((t[2] - f[2]) * p + f[2]) + (f[3] < 0 && t[3] < 0 ? ")" : "," + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000 : t[3] < 0 ? f[3] : t[3]) + ")");else return "#" + (0x100000000 + (f[3] > -1 && t[3] > -1 ? r(((t[3] - f[3]) * p + f[3]) * 255) : t[3] > -1 ? r(t[3] * 255) : f[3] > -1 ? r(f[3] * 255) : 255) * 0x1000000 + r((t[0] - f[0]) * p + f[0]) * 0x10000 + r((t[1] - f[1]) * p + f[1]) * 0x100 + r((t[2] - f[2]) * p + f[2])).toString(16).slice(f[3] > -1 || t[3] > -1 ? 1 : 3);
    }

    var DarkenValueConverter = exports.DarkenValueConverter = function () {
        function DarkenValueConverter() {
            _classCallCheck(this, DarkenValueConverter);
        }

        DarkenValueConverter.prototype.toView = function toView(value, steps) {
            return shadeBlendConvert(-0.3 * parseFloat(steps, 10), value);
        };

        return DarkenValueConverter;
    }();

    var LightenValueConverter = exports.LightenValueConverter = function () {
        function LightenValueConverter() {
            _classCallCheck(this, LightenValueConverter);
        }

        LightenValueConverter.prototype.toView = function toView(value, steps) {
            return shadeBlendConvert(0.3 * parseFloat(steps, 10), value);
        };

        return LightenValueConverter;
    }();
});
define('aurelia-materialize-bridge/colors/md-colors',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdColors = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _class, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var MdColors = exports.MdColors = (_dec = (0, _aureliaTemplating.bindable)(), _dec2 = (0, _aureliaTemplating.bindable)(), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), (_class = function MdColors() {
    _classCallCheck(this, MdColors);

    _initDefineProp(this, 'mdPrimaryColor', _descriptor, this);

    _initDefineProp(this, 'mdAccentColor', _descriptor2, this);

    _initDefineProp(this, 'mdErrorColor', _descriptor3, this);

    _initDefineProp(this, 'mdSuccessColor', _descriptor4, this);
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'mdPrimaryColor', [_dec], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'mdAccentColor', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class.prototype, 'mdErrorColor', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return '#F44336';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class.prototype, 'mdSuccessColor', [_dec4], {
    enumerable: true,
    initializer: null
  })), _class));
});
define('aurelia-materialize-bridge/datepicker/datepicker-default-parser',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DatePickerDefaultParser = exports.DatePickerDefaultParser = function () {
    function DatePickerDefaultParser() {
      _classCallCheck(this, DatePickerDefaultParser);
    }

    DatePickerDefaultParser.prototype.canParse = function canParse(value) {
      if (value) {
        return true;
      }
      return false;
    };

    DatePickerDefaultParser.prototype.parse = function parse(value) {
      if (value) {
        var result = value.split('/').join('-');
        result = new Date(result);
        return isNaN(result) ? null : result;
      }
      return null;
    };

    return DatePickerDefaultParser;
  }();
});
define('aurelia-materialize-bridge/datepicker/datepicker',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-task-queue', 'aurelia-dependency-injection', 'aurelia-logging', '../common/attributes', './datepicker-default-parser', '../common/events'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaTaskQueue, _aureliaDependencyInjection, _aureliaLogging, _attributes, _datepickerDefaultParser, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdDatePicker = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8;

  var MdDatePicker = exports.MdDatePicker = (_dec = (0, _aureliaDependencyInjection.inject)(Element, _aureliaTaskQueue.TaskQueue, _datepickerDefaultParser.DatePickerDefaultParser), _dec2 = (0, _aureliaTemplating.customAttribute)('md-datepicker'), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec6 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.twoWay }), _dec7 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec8 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec9 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec10 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdDatePicker(element, taskQueue, defaultParser) {
      _classCallCheck(this, MdDatePicker);

      _initDefineProp(this, 'container', _descriptor, this);

      _initDefineProp(this, 'translation', _descriptor2, this);

      _initDefineProp(this, 'value', _descriptor3, this);

      _initDefineProp(this, 'parsers', _descriptor4, this);

      _initDefineProp(this, 'selectMonths', _descriptor5, this);

      _initDefineProp(this, 'selectYears', _descriptor6, this);

      _initDefineProp(this, 'options', _descriptor7, this);

      _initDefineProp(this, 'showErrortext', _descriptor8, this);

      this.element = element;
      this.log = (0, _aureliaLogging.getLogger)('md-datepicker');
      this.taskQueue = taskQueue;
      this.parsers.push(defaultParser);
    }

    MdDatePicker.prototype.bind = function bind() {
      var _this = this;

      this.selectMonths = (0, _attributes.getBooleanFromAttributeValue)(this.selectMonths);
      this.selectYears = parseInt(this.selectYears, 10);
      this.element.classList.add('date-picker');

      var options = {
        selectMonths: this.selectMonths,
        selectYears: this.selectYears,
        onClose: function onClose() {
          $(document.activeElement).blur();
        }
      };
      var i18n = {};

      Object.assign(options, i18n);

      if (this.options) {
        Object.assign(options, this.options);

        if (this.options.onClose) {
          options.onClose = function () {
            this.options.onClose();
            $(document.activeElement).blur();
          };
        }
      }
      if (this.container) {
        options.container = this.container;
      }
      this.picker = $(this.element).pickadate(options).pickadate('picker');
      this.picker.on({
        'close': this.onClose.bind(this),
        'set': this.onSet.bind(this)
      });

      if (this.value) {
        this.picker.set('select', this.value);
      }
      if (this.options && this.options.editable) {
        $(this.element).on('keydown', function (e) {
          if (e.keyCode === 13 || e.keyCode === 9) {
            if (_this.parseDate($(_this.element).val())) {
              _this.closeDatePicker();
            } else {
              _this.openDatePicker();
            }
          } else {
            _this.value = null;
          }
        });
      } else {
        $(this.element).on('focusin', function () {
          _this.openDatePicker();
        });
      }
      if (this.options.showIcon) {
        this.element.classList.add('left');
        var calendarIcon = document.createElement('i');
        calendarIcon.classList.add('right');
        calendarIcon.classList.add('material-icons');
        calendarIcon.textContent = 'today';
        this.element.parentNode.insertBefore(calendarIcon, this.element.nextSibling);
        $(calendarIcon).on('click', this.onCalendarIconClick.bind(this));
      }

      this.movePickerCloserToSrc();
      this.setErrorTextAttribute();
    };

    MdDatePicker.prototype.parseDate = function parseDate(value) {
      if (this.parsers && this.parsers.length && this.parsers.length > 0) {
        for (var _iterator = this.parsers, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var parser = _ref;

          if (parser.canParse(value)) {
            var parsedDate = parser.parse(value);
            if (parsedDate !== null) {
              this.picker.set('select', parsedDate);
              return true;
            }
          }
        }
      }
      return false;
    };

    MdDatePicker.prototype.movePickerCloserToSrc = function movePickerCloserToSrc() {
      $(this.picker.$root).appendTo($(this.element).parent());
    };

    MdDatePicker.prototype.detached = function detached() {
      if (this.picker) {
        this.picker.stop();
      }
    };

    MdDatePicker.prototype.openDatePicker = function openDatePicker() {
      $(this.element).pickadate('open');
    };

    MdDatePicker.prototype.closeDatePicker = function closeDatePicker() {
      $(this.element).pickadate('close');
    };

    MdDatePicker.prototype.onClose = function onClose() {
      var selected = this.picker.get('select');
      this.value = selected ? selected.obj : null;
      (0, _events.fireEvent)(this.element, 'blur');
    };

    MdDatePicker.prototype.onCalendarIconClick = function onCalendarIconClick(event) {
      event.stopPropagation();
      this.openDatePicker();
    };

    MdDatePicker.prototype.onSet = function onSet(value) {
      if (this.options && this.options.closeOnSelect && value.select) {
        this.value = value.select;
        this.picker.close();
      }
    };

    MdDatePicker.prototype.valueChanged = function valueChanged(newValue) {
      if (this.options.max && newValue > this.options.max) {
        this.value = this.options.max;
      }
      this.log.debug('selectedChanged', this.value);

      this.picker.set('select', this.value);
    };

    MdDatePicker.prototype.showErrortextChanged = function showErrortextChanged() {
      this.setErrorTextAttribute();
    };

    MdDatePicker.prototype.setErrorTextAttribute = function setErrorTextAttribute() {
      var element = this.element;
      if (!element) return;
      this.log.debug('showErrortextChanged: ' + this.showErrortext);
      element.setAttribute('data-show-errortext', (0, _attributes.getBooleanFromAttributeValue)(this.showErrortext));
    };

    return MdDatePicker;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'container', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'translation', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec5], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'parsers', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'selectMonths', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'selectYears', [_dec8], {
    enumerable: true,
    initializer: function initializer() {
      return 15;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'options', [_dec9], {
    enumerable: true,
    initializer: function initializer() {
      return {};
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'showErrortext', [_dec10], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/dropdown/dropdown-element',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdDropdownElement = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _temp;

  var MdDropdownElement = exports.MdDropdownElement = (_dec = (0, _aureliaTemplating.customElement)('md-dropdown'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec7 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec8 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec9 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec10 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function MdDropdownElement(element) {
      _classCallCheck(this, MdDropdownElement);

      _initDefineProp(this, 'alignment', _descriptor, this);

      _initDefineProp(this, 'belowOrigin', _descriptor2, this);

      _initDefineProp(this, 'constrainWidth', _descriptor3, this);

      _initDefineProp(this, 'gutter', _descriptor4, this);

      _initDefineProp(this, 'hover', _descriptor5, this);

      _initDefineProp(this, 'mdTitle', _descriptor6, this);

      _initDefineProp(this, 'inDuration', _descriptor7, this);

      _initDefineProp(this, 'outDuration', _descriptor8, this);

      this.element = element;
      this.controlId = 'md-dropdown-' + MdDropdown.id++;
    }

    MdDropdownElement.prototype.attached = function attached() {
      $(this.element).dropdown({
        alignment: this.alignment,
        belowOrigin: (0, _attributes.getBooleanFromAttributeValue)(this.belowOrigin),
        constrain_width: (0, _attributes.getBooleanFromAttributeValue)(this.constrainWidth),
        gutter: parseInt(this.gutter, 10),
        hover: (0, _attributes.getBooleanFromAttributeValue)(this.hover),
        inDuration: parseInt(this.inDuration, 10),
        outDuration: parseInt(this.outDuration, 10)
      });
    };

    return MdDropdownElement;
  }(), _class3.id = 0, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'alignment', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return 'left';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'belowOrigin', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'constrainWidth', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'gutter', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'hover', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'mdTitle', [_dec8], {
    enumerable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'inDuration', [_dec9], {
    enumerable: true,
    initializer: function initializer() {
      return 300;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'outDuration', [_dec10], {
    enumerable: true,
    initializer: function initializer() {
      return 225;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/dropdown/dropdown',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributeManager, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdDropdown = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9;

  var MdDropdown = exports.MdDropdown = (_dec = (0, _aureliaTemplating.customAttribute)('md-dropdown'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec7 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec8 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec9 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec10 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec11 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdDropdown(element) {
      _classCallCheck(this, MdDropdown);

      _initDefineProp(this, 'activates', _descriptor, this);

      _initDefineProp(this, 'alignment', _descriptor2, this);

      _initDefineProp(this, 'belowOrigin', _descriptor3, this);

      _initDefineProp(this, 'constrainWidth', _descriptor4, this);

      _initDefineProp(this, 'gutter', _descriptor5, this);

      _initDefineProp(this, 'hover', _descriptor6, this);

      _initDefineProp(this, 'mdTitle', _descriptor7, this);

      _initDefineProp(this, 'inDuration', _descriptor8, this);

      _initDefineProp(this, 'outDuration', _descriptor9, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdDropdown.prototype.attached = function attached() {
      this.contentAttributeManager = new _attributeManager.AttributeManager(document.getElementById(this.activates));

      this.attributeManager.addClasses('dropdown-button');
      this.contentAttributeManager.addClasses('dropdown-content');
      this.attributeManager.addAttributes({ 'data-activates': this.activates });
      $(this.element).dropdown({
        alignment: this.alignment,
        belowOrigin: (0, _attributes.getBooleanFromAttributeValue)(this.belowOrigin),
        constrain_width: (0, _attributes.getBooleanFromAttributeValue)(this.constrainWidth),
        gutter: parseInt(this.gutter, 10),
        hover: (0, _attributes.getBooleanFromAttributeValue)(this.hover),
        inDuration: parseInt(this.inDuration, 10),
        outDuration: parseInt(this.outDuration, 10)
      });
    };

    MdDropdown.prototype.detached = function detached() {
      this.attributeManager.removeAttributes('data-activates');
      this.attributeManager.removeClasses('dropdown-button');
      this.contentAttributeManager.removeClasses('dropdown-content');
    };

    return MdDropdown;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'activates', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'alignment', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 'left';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'belowOrigin', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'constrainWidth', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'gutter', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'hover', [_dec8], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'mdTitle', [_dec9], {
    enumerable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'inDuration', [_dec10], {
    enumerable: true,
    initializer: function initializer() {
      return 300;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'outDuration', [_dec11], {
    enumerable: true,
    initializer: function initializer() {
      return 225;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/dropdown/dropdown-fix',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.applyMaterializeDropdownFix = applyMaterializeDropdownFix;
  function applyMaterializeDropdownFix() {
    $.fn.dropdown = function (options) {
      var defaults = {
        inDuration: 300,
        outDuration: 225,
        constrain_width: true,
        hover: false,
        gutter: 0,
        belowOrigin: false,
        alignment: 'left',
        stopPropagation: false
      };

      if (options === "open") {
        this.each(function () {
          $(this).trigger('open');
        });
        return false;
      }

      if (options === "close") {
        this.each(function () {
          $(this).trigger('close');
        });
        return false;
      }

      this.each(function () {
        var origin = $(this);
        var curr_options = $.extend({}, defaults, options);
        var isFocused = false;

        var activates = $("#" + origin.attr('data-activates'));

        function updateOptions() {
          if (origin.data('induration') !== undefined) curr_options.inDuration = origin.data('induration');
          if (origin.data('outduration') !== undefined) curr_options.outDuration = origin.data('outduration');
          if (origin.data('constrainwidth') !== undefined) curr_options.constrain_width = origin.data('constrainwidth');
          if (origin.data('hover') !== undefined) curr_options.hover = origin.data('hover');
          if (origin.data('gutter') !== undefined) curr_options.gutter = origin.data('gutter');
          if (origin.data('beloworigin') !== undefined) curr_options.belowOrigin = origin.data('beloworigin');
          if (origin.data('alignment') !== undefined) curr_options.alignment = origin.data('alignment');
          if (origin.data('stoppropagation') !== undefined) curr_options.stopPropagation = origin.data('stoppropagation');
        }

        updateOptions();

        origin.after(activates);

        function placeDropdown(eventType) {
          if (eventType === 'focus') {
            isFocused = true;
          }

          updateOptions();

          activates.addClass('active');
          origin.addClass('active');

          if (curr_options.constrain_width === true) {
            activates.css('width', origin.outerWidth());
          } else {
            activates.css('white-space', 'nowrap');
          }

          var windowHeight = window.innerHeight;
          var originHeight = origin.innerHeight();
          var offsetLeft = origin.offset().left;
          var offsetTop = origin.offset().top - $(window).scrollTop();
          var currAlignment = curr_options.alignment;
          var gutterSpacing = 0;
          var leftPosition = 0;

          var verticalOffset = 0;
          if (curr_options.belowOrigin === true) {
            verticalOffset = originHeight;
          }

          var scrollYOffset = 0;
          var scrollXOffset = 0;
          var wrapper = origin.parent();
          if (!wrapper.is('body')) {
            if (wrapper[0].scrollHeight > wrapper[0].clientHeight) {
              scrollYOffset = wrapper[0].scrollTop;
            }
            if (wrapper[0].scrollWidth > wrapper[0].clientWidth) {
              scrollXOffset = wrapper[0].scrollLeft;
            }
          }

          if (offsetLeft + activates.innerWidth() > $(window).width()) {
            currAlignment = 'right';
          } else if (offsetLeft - activates.innerWidth() + origin.innerWidth() < 0) {
            currAlignment = 'left';
          }

          if (offsetTop + activates.innerHeight() > windowHeight) {
            if (offsetTop + originHeight - activates.innerHeight() < 0) {
              var adjustedHeight = windowHeight - offsetTop - verticalOffset;
              activates.css('max-height', adjustedHeight);
            } else {
              if (!verticalOffset) {
                verticalOffset += originHeight;
              }
              verticalOffset -= activates.innerHeight();
            }
          }

          if (currAlignment === 'left') {
            gutterSpacing = curr_options.gutter;
            leftPosition = origin.position().left + gutterSpacing;
          } else if (currAlignment === 'right') {
            var offsetRight = origin.position().left + origin.outerWidth() - activates.outerWidth();
            gutterSpacing = -curr_options.gutter;
            leftPosition = offsetRight + gutterSpacing;
          }

          activates.css({
            position: 'absolute',
            top: origin.position().top + verticalOffset + scrollYOffset,
            left: leftPosition + scrollXOffset
          });

          activates.stop(true, true).css('opacity', 0).slideDown({
            queue: false,
            duration: curr_options.inDuration,
            easing: 'easeOutCubic',
            complete: function complete() {
              $(this).css('height', '');
            }
          }).animate({ opacity: 1 }, { queue: false, duration: curr_options.inDuration, easing: 'easeOutSine' });
        }

        function hideDropdown() {
          isFocused = false;
          activates.fadeOut(curr_options.outDuration);
          activates.removeClass('active');
          origin.removeClass('active');
          setTimeout(function () {
            activates.css('max-height', '');
          }, curr_options.outDuration);
        }

        if (curr_options.hover) {
          var open = false;
          origin.unbind('click.' + origin.attr('id'));

          origin.on('mouseenter', function (e) {
            if (open === false) {
              placeDropdown();
              open = true;
            }
          });
          origin.on('mouseleave', function (e) {
            var toEl = e.toElement || e.relatedTarget;
            if (!$(toEl).closest('.dropdown-content').is(activates)) {
              activates.stop(true, true);
              hideDropdown();
              open = false;
            }
          });

          activates.on('mouseleave', function (e) {
            var toEl = e.toElement || e.relatedTarget;
            if (!$(toEl).closest('.dropdown-button').is(origin)) {
              activates.stop(true, true);
              hideDropdown();
              open = false;
            }
          });
        } else {
            origin.unbind('click.' + origin.attr('id'));
            origin.bind('click.' + origin.attr('id'), function (e) {
              if (!isFocused) {
                if (origin[0] == e.currentTarget && !origin.hasClass('active') && $(e.target).closest('.dropdown-content').length === 0) {
                  e.preventDefault();
                  if (curr_options.stopPropagation) {
                    e.stopPropagation();
                  }
                  placeDropdown('click');
                } else if (origin.hasClass('active')) {
                    hideDropdown();
                    $(document).unbind('click.' + activates.attr('id') + ' touchstart.' + activates.attr('id'));
                  }

                if (activates.hasClass('active')) {
                  $(document).bind('click.' + activates.attr('id') + ' touchstart.' + activates.attr('id'), function (e) {
                    if (!activates.is(e.target) && !origin.is(e.target) && !origin.find(e.target).length) {
                      hideDropdown();
                      $(document).unbind('click.' + activates.attr('id') + ' touchstart.' + activates.attr('id'));
                    }
                  });
                }
              }
            });
          }
        origin.on('open', function (e, eventType) {
          placeDropdown(eventType);
        });
        origin.on('close', hideDropdown);
      });
    };

    $(document).ready(function () {
      $('.dropdown-button').dropdown();
    });
  }
});
define('aurelia-materialize-bridge/fab/fab',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdFab = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var MdFab = exports.MdFab = (_dec = (0, _aureliaTemplating.customElement)('md-fab'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdFab(element) {
      _classCallCheck(this, MdFab);

      _initDefineProp(this, 'mdFixed', _descriptor, this);

      _initDefineProp(this, 'mdLarge', _descriptor2, this);

      this.element = element;
    }

    MdFab.prototype.attached = function attached() {
      this.mdFixed = (0, _attributes.getBooleanFromAttributeValue)(this.mdFixed);
      this.mdLarge = (0, _attributes.getBooleanFromAttributeValue)(this.mdLarge);
    };

    return MdFab;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdFixed', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdLarge', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/file/file',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/events', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _events, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdFileInput = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdFileInput = exports.MdFileInput = (_dec = (0, _aureliaTemplating.customElement)('md-file'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdFileInput(element) {
      _classCallCheck(this, MdFileInput);

      _initDefineProp(this, 'mdCaption', _descriptor, this);

      _initDefineProp(this, 'mdMultiple', _descriptor2, this);

      _initDefineProp(this, 'mdLabelValue', _descriptor3, this);

      this.files = [];
      this._suspendUpdate = false;

      this.element = element;
      this.handleChangeFromNativeInput = this.handleChangeFromNativeInput.bind(this);
    }

    MdFileInput.prototype.attached = function attached() {
      this.mdMultiple = (0, _attributes.getBooleanFromAttributeValue)(this.mdMultiple);
      $(this.filePath).on('change', this.handleChangeFromNativeInput);
    };

    MdFileInput.prototype.detached = function detached() {
      $(this.element).off('change', this.handleChangeFromNativeInput);
    };

    MdFileInput.prototype.handleChangeFromNativeInput = function handleChangeFromNativeInput() {
      if (!this._suspendUpdate) {
        this._suspendUpdate = true;
        (0, _events.fireEvent)(this.filePath, 'change', { files: this.files });
        (0, _events.fireMaterializeEvent)(this.filePath, 'change', { files: this.files });
        this._suspendUpdate = false;
      }
    };

    return MdFileInput;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdCaption', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return 'File';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdMultiple', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdLabelValue', [_dec5], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/footer/footer',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdFooter = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdFooter = exports.MdFooter = (_dec = (0, _aureliaTemplating.customAttribute)('md-footer'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function MdFooter(element) {
      _classCallCheck(this, MdFooter);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdFooter.prototype.bind = function bind() {
      this.attributeManager.addClasses('page-footer');
    };

    MdFooter.prototype.unbind = function unbind() {
      this.attributeManager.removeClasses('page-footer');
    };

    return MdFooter;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/input/input-prefix',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdPrefix = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdPrefix = exports.MdPrefix = (_dec = (0, _aureliaTemplating.customAttribute)('md-prefix'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function MdPrefix(element) {
      _classCallCheck(this, MdPrefix);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdPrefix.prototype.bind = function bind() {
      this.attributeManager.addClasses('prefix');
    };

    MdPrefix.prototype.unbind = function unbind() {
      this.attributeManager.removeClasses('prefix');
    };

    return MdPrefix;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/input/input-update-service',['exports', 'aurelia-task-queue', 'aurelia-dependency-injection', 'aurelia-logging'], function (exports, _aureliaTaskQueue, _aureliaDependencyInjection, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdInputUpdateService = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var MdInputUpdateService = exports.MdInputUpdateService = (_dec = (0, _aureliaDependencyInjection.inject)(_aureliaTaskQueue.TaskQueue), _dec(_class = function () {
    function MdInputUpdateService(taskQueue) {
      _classCallCheck(this, MdInputUpdateService);

      this._updateCalled = false;

      this.log = (0, _aureliaLogging.getLogger)('MdInputUpdateService');
      this.taskQueue = taskQueue;
    }

    MdInputUpdateService.prototype.materializeUpdate = function materializeUpdate() {
      this.log.debug('executing Materialize.updateTextFields');
      Materialize.updateTextFields();
      this._updateCalled = false;
    };

    MdInputUpdateService.prototype.update = function update() {
      this.log.debug('update called');
      if (!this._updateCalled) {
        this._updateCalled = true;
        this.taskQueue.queueTask(this.materializeUpdate.bind(this));
      }
    };

    return MdInputUpdateService;
  }()) || _class);
});
define('aurelia-materialize-bridge/input/input',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', '../common/attributes', './input-update-service', '../common/events'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _attributes, _inputUpdateService, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdInput = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class3, _temp;

  var MdInput = exports.MdInput = (_dec = (0, _aureliaTemplating.customElement)('md-input'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaTaskQueue.TaskQueue, _inputUpdateService.MdInputUpdateService), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec7 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec8 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec9 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec10 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec11 = (0, _aureliaTemplating.bindable)(), _dec12 = (0, _aureliaTemplating.bindable)(), _dec13 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function MdInput(element, taskQueue, updateService) {
      _classCallCheck(this, MdInput);

      _initDefineProp(this, 'mdLabel', _descriptor, this);

      _initDefineProp(this, 'mdDisabled', _descriptor2, this);

      _initDefineProp(this, 'mdPlaceholder', _descriptor3, this);

      _initDefineProp(this, 'mdTextArea', _descriptor4, this);

      _initDefineProp(this, 'mdType', _descriptor5, this);

      _initDefineProp(this, 'mdStep', _descriptor6, this);

      _initDefineProp(this, 'mdValidate', _descriptor7, this);

      _initDefineProp(this, 'mdShowErrortext', _descriptor8, this);

      _initDefineProp(this, 'mdValidateError', _descriptor9, this);

      _initDefineProp(this, 'mdValidateSuccess', _descriptor10, this);

      _initDefineProp(this, 'mdValue', _descriptor11, this);

      this._suspendUpdate = false;

      this.element = element;
      this.taskQueue = taskQueue;
      this.controlId = 'md-input-' + MdInput.id++;
      this.updateService = updateService;
    }

    MdInput.prototype.bind = function bind() {
      this.mdTextArea = (0, _attributes.getBooleanFromAttributeValue)(this.mdTextArea);
      this.mdShowErrortext = (0, _attributes.getBooleanFromAttributeValue)(this.mdShowErrortext);
    };

    MdInput.prototype.attached = function attached() {
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdValidate)) {
        this.input.classList.add('validate');
      }
      if (this.mdValidateError) {
        this.label.setAttribute('data-error', this.mdValidateError);
      }
      if (this.mdValidateSuccess) {
        this.label.setAttribute('data-success', this.mdValidateSuccess);
      }
      if (this.mdPlaceholder) {
        this.input.setAttribute('placeholder', this.mdPlaceholder);
      }
      if (this.mdShowErrortext) {
        this.input.setAttribute('data-show-errortext', this.mdShowErrortext);
      }
      this.updateService.update();

      if (this.mdType === 'time') {
        $(this.input).siblings('label').addClass('active');
      }
    };

    MdInput.prototype.blur = function blur() {
      (0, _events.fireEvent)(this.element, 'blur');
    };

    MdInput.prototype.mdValueChanged = function mdValueChanged() {
      if (!$(this.input).is(':focus')) {
        this.updateService.update();
      }
      if (this.mdTextArea) {
        $(this.input).trigger('autoresize');
      }
    };

    return MdInput;
  }(), _class3.id = 0, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdLabel', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdDisabled', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdPlaceholder', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdTextArea', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mdType', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return 'text';
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'mdStep', [_dec8], {
    enumerable: true,
    initializer: function initializer() {
      return 'any';
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'mdValidate', [_dec9], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, 'mdShowErrortext', [_dec10], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, 'mdValidateError', [_dec11], {
    enumerable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, 'mdValidateSuccess', [_dec12], {
    enumerable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, 'mdValue', [_dec13], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/modal/modal',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributes', '../common/attributeManager', '../common/events'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributes, _attributeManager, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdModal = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdModal = exports.MdModal = (_dec = (0, _aureliaTemplating.customAttribute)('md-modal'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdModal(element) {
      _classCallCheck(this, MdModal);

      _initDefineProp(this, 'dismissible', _descriptor, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
      this.onComplete = this.onComplete.bind(this);
      this.onReady = this.onReady.bind(this);
    }

    MdModal.prototype.attached = function attached() {
      this.attributeManager.addClasses('modal');
      $(this.element).modal({
        complete: this.onComplete,
        dismissible: (0, _attributes.getBooleanFromAttributeValue)(this.dismissible),
        ready: this.onReady
      });
    };

    MdModal.prototype.detached = function detached() {
      this.attributeManager.removeClasses('modal');
    };

    MdModal.prototype.onComplete = function onComplete() {
      (0, _events.fireMaterializeEvent)(this.element, 'modal-complete');
    };

    MdModal.prototype.onReady = function onReady(modal, trigger) {
      (0, _events.fireMaterializeEvent)(this.element, 'modal-ready', { modal: modal, trigger: trigger });
    };

    MdModal.prototype.open = function open() {
      $(this.element).modal('open');
    };

    MdModal.prototype.close = function close() {
      $(this.element).modal('close');
    };

    return MdModal;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'dismissible', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/modal/modal-trigger',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributes', '../common/attributeManager', '../common/events'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributes, _attributeManager, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdModalTrigger = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdModalTrigger = exports.MdModalTrigger = (_dec = (0, _aureliaTemplating.customAttribute)('md-modal-trigger'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdModalTrigger(element) {
      _classCallCheck(this, MdModalTrigger);

      _initDefineProp(this, 'dismissible', _descriptor, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
      this.onComplete = this.onComplete.bind(this);
    }

    MdModalTrigger.prototype.attached = function attached() {
      this.attributeManager.addClasses('modal-trigger');
      $(this.element).leanModal({
        complete: this.onComplete,
        dismissible: (0, _attributes.getBooleanFromAttributeValue)(this.dismissible)
      });
    };

    MdModalTrigger.prototype.detached = function detached() {
      this.attributeManager.removeClasses('modal-trigger');
    };

    MdModalTrigger.prototype.onComplete = function onComplete() {
      (0, _events.fireMaterializeEvent)(this.element, 'modal-complete');
    };

    return MdModalTrigger;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'dismissible', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/navbar/navbar',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributes', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributes, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdNavbar = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdNavbar = exports.MdNavbar = (_dec = (0, _aureliaTemplating.customElement)('md-navbar'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdNavbar(element) {
      _classCallCheck(this, MdNavbar);

      _initDefineProp(this, 'mdFixed', _descriptor, this);

      this.element = element;
    }

    MdNavbar.prototype.attached = function attached() {
      this.fixedAttributeManager = new _attributeManager.AttributeManager(this.fixedAnchor);
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdFixed)) {
        this.fixedAttributeManager.addClasses('navbar-fixed');
      }
    };

    MdNavbar.prototype.detached = function detached() {
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdFixed)) {
        this.fixedAttributeManager.removeClasses('navbar-fixed');
      }
    };

    return MdNavbar;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdFixed', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/pagination/pagination',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/events', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _events, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdPagination = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7;

  var MdPagination = exports.MdPagination = (_dec = (0, _aureliaTemplating.customElement)('md-pagination'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneWay
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneWay
  }), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneWay
  }), _dec7 = (0, _aureliaTemplating.bindable)(), _dec8 = (0, _aureliaTemplating.bindable)(), _dec9 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdPagination(element) {
      _classCallCheck(this, MdPagination);

      _initDefineProp(this, 'mdActivePage', _descriptor, this);

      _initDefineProp(this, 'mdPages', _descriptor2, this);

      _initDefineProp(this, 'mdVisiblePageLinks', _descriptor3, this);

      _initDefineProp(this, 'mdPageLinks', _descriptor4, this);

      _initDefineProp(this, 'mdShowFirstLast', _descriptor5, this);

      _initDefineProp(this, 'mdShowPrevNext', _descriptor6, this);

      _initDefineProp(this, 'mdShowPageLinks', _descriptor7, this);

      this.numberOfLinks = 15;
      this.pages = 5;

      this.element = element;
    }

    MdPagination.prototype.bind = function bind() {
      this.pages = parseInt(this.mdPages, 10);

      this.numberOfLinks = Math.min(parseInt(this.mdVisiblePageLinks, 10), this.pages);
      this.mdShowFirstLast = (0, _attributes.getBooleanFromAttributeValue)(this.mdShowFirstLast);
      this.mdShowPrevNext = (0, _attributes.getBooleanFromAttributeValue)(this.mdShowPrevNext);
      this.mdPageLinks = this.generatePageLinks();
    };

    MdPagination.prototype.setActivePage = function setActivePage(page) {
      this.mdActivePage = parseInt(page, 10);
      this.mdPageLinks = this.generatePageLinks();
      (0, _events.fireMaterializeEvent)(this.element, 'page-changed', this.mdActivePage);
    };

    MdPagination.prototype.setFirstPage = function setFirstPage() {
      if (this.mdActivePage > 1) {
        this.setActivePage(1);
      }
    };

    MdPagination.prototype.setLastPage = function setLastPage() {
      if (this.mdActivePage < this.pages) {
        this.setActivePage(this.pages);
      }
    };

    MdPagination.prototype.setPreviousPage = function setPreviousPage() {
      if (this.mdActivePage > 1) {
        this.setActivePage(this.mdActivePage - 1);
      }
    };

    MdPagination.prototype.setNextPage = function setNextPage() {
      if (this.mdActivePage < this.pages) {
        this.setActivePage(this.mdActivePage + 1);
      }
    };

    MdPagination.prototype.mdPagesChanged = function mdPagesChanged() {
      this.pages = parseInt(this.mdPages, 10);
      this.numberOfLinks = Math.min(parseInt(this.mdVisiblePageLinks, 10), this.pages);
      this.setActivePage(1);
    };

    MdPagination.prototype.mdVisiblePageLinksChanged = function mdVisiblePageLinksChanged() {
      this.numberOfLinks = Math.min(parseInt(this.mdVisiblePageLinks, 10), this.pages);
      this.mdPageLinks = this.generatePageLinks();
    };

    MdPagination.prototype.generatePageLinks = function generatePageLinks() {
      var midPoint = parseInt(this.numberOfLinks / 2, 10);
      var start = Math.max(this.mdActivePage - midPoint, 0);

      if (start + midPoint * 2 > this.pages) start = this.pages - midPoint * 2;
      var end = Math.min(start + this.numberOfLinks, this.pages);

      var list = [];
      for (var i = start; i < end; i++) {
        list.push(i);
      }

      return list;
    };

    return MdPagination;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdActivePage', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdPages', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 5;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdVisiblePageLinks', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return 15;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdPageLinks', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mdShowFirstLast', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'mdShowPrevNext', [_dec8], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, 'mdShowPageLinks', [_dec9], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/parallax/parallax',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdParallax = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdParallax = exports.MdParallax = (_dec = (0, _aureliaTemplating.customAttribute)('md-parallax'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function MdParallax(element) {
      _classCallCheck(this, MdParallax);

      this.element = element;
    }

    MdParallax.prototype.attached = function attached() {
      $(this.element).parallax();
    };

    MdParallax.prototype.detached = function detached() {};

    return MdParallax;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/progress/progress',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdProgress = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var MdProgress = exports.MdProgress = (_dec = (0, _aureliaTemplating.customElement)('md-progress'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec5 = (0, _aureliaTemplating.bindable)(), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec7 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdProgress(element) {
      _classCallCheck(this, MdProgress);

      _initDefineProp(this, 'mdColor', _descriptor, this);

      _initDefineProp(this, 'mdPixelSize', _descriptor2, this);

      _initDefineProp(this, 'mdSize', _descriptor3, this);

      _initDefineProp(this, 'mdType', _descriptor4, this);

      _initDefineProp(this, 'mdValue', _descriptor5, this);

      this.element = element;
    }

    MdProgress.prototype.mdSizeChanged = function mdSizeChanged(newValue) {
      this.mdPixelSize = null;
      if (this.wrapper) {
        this.wrapper.style.height = '';
        this.wrapper.style.width = '';
      }
    };

    MdProgress.prototype.mdPixelSizeChanged = function mdPixelSizeChanged(newValue) {
      if (isNaN(newValue)) {
        this.mdPixelSize = null;
      } else {
        this.mdSize = '';
        if (this.wrapper) {
          this.wrapper.style.height = newValue + 'px';
          this.wrapper.style.width = newValue + 'px';
        }
      }
    };

    return MdProgress;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdColor', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdPixelSize', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdSize', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return 'big';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdType', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return 'linear';
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mdValue', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/pushpin/pushpin',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdPushpin = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdPushpin = exports.MdPushpin = (_dec = (0, _aureliaTemplating.customAttribute)('md-pushpin'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdPushpin(element) {
      _classCallCheck(this, MdPushpin);

      _initDefineProp(this, 'bottom', _descriptor, this);

      _initDefineProp(this, 'offset', _descriptor2, this);

      _initDefineProp(this, 'top', _descriptor3, this);

      this.element = element;
    }

    MdPushpin.prototype.attached = function attached() {
      $(this.element).pushpin({
        bottom: this.bottom === Infinity ? Infinity : parseInt(this.bottom, 10),
        offset: parseInt(this.offset, 10),
        top: parseInt(this.top, 10)
      });
    };

    MdPushpin.prototype.detached = function detached() {};

    return MdPushpin;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'bottom', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return Infinity;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'offset', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'top', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/radio/radio',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributeManager, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdRadio = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _temp;

  var MdRadio = exports.MdRadio = (_dec = (0, _aureliaTemplating.customElement)('md-radio'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec6 = (0, _aureliaTemplating.bindable)(), _dec7 = (0, _aureliaTemplating.bindable)(), _dec8 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function MdRadio(element) {
      _classCallCheck(this, MdRadio);

      _initDefineProp(this, 'mdChecked', _descriptor, this);

      _initDefineProp(this, 'mdDisabled', _descriptor2, this);

      _initDefineProp(this, 'mdGap', _descriptor3, this);

      _initDefineProp(this, 'mdModel', _descriptor4, this);

      _initDefineProp(this, 'mdName', _descriptor5, this);

      _initDefineProp(this, 'mdValue', _descriptor6, this);

      this.element = element;
      this.controlId = 'md-radio-' + MdRadio.id++;
    }

    MdRadio.prototype.attached = function attached() {
      this.attributeManager = new _attributeManager.AttributeManager(this.radio);
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdGap)) {
        this.attributeManager.addClasses('with-gap');
      }
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdDisabled)) {
        this.radio.disabled = true;
      }
    };

    MdRadio.prototype.detached = function detached() {
      this.attributeManager.removeClasses(['with-gap', 'disabled']);
    };

    MdRadio.prototype.mdDisabledChanged = function mdDisabledChanged(newValue) {
      if (this.radio) {
        this.radio.disabled = !!newValue;
      }
    };

    return MdRadio;
  }(), _class3.id = 0, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdChecked', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdDisabled', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdGap', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdModel', [_dec6], {
    enumerable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mdName', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'mdValue', [_dec8], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/range/range',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdRange = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var MdRange = exports.MdRange = (_dec = (0, _aureliaTemplating.customElement)('md-range'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec6 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec(_class = _dec2(_class = (_class2 = function MdRange(element) {
    _classCallCheck(this, MdRange);

    _initDefineProp(this, 'mdMin', _descriptor, this);

    _initDefineProp(this, 'mdMax', _descriptor2, this);

    _initDefineProp(this, 'mdStep', _descriptor3, this);

    _initDefineProp(this, 'mdValue', _descriptor4, this);

    this.element = element;
    this.log = (0, _aureliaLogging.getLogger)('md-range');
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdMin', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdMax', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 100;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdStep', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdValue', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/scrollfire/scrollfire-patch',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _class, _temp;

  var ScrollfirePatch = exports.ScrollfirePatch = (_temp = _class = function () {
    function ScrollfirePatch() {
      _classCallCheck(this, ScrollfirePatch);
    }

    ScrollfirePatch.prototype.patch = function patch() {
      if (!ScrollfirePatch.patched) {
        ScrollfirePatch.patched = true;

        window.Materialize.scrollFire = function (options) {
          var didScroll = false;
          window.addEventListener('scroll', function () {
            didScroll = true;
          });

          setInterval(function () {
            if (didScroll) {
              didScroll = false;

              var windowScroll = window.pageYOffset + window.innerHeight;
              for (var i = 0; i < options.length; i++) {
                var value = options[i];
                var selector = value.selector;
                var offset = value.offset;
                var callback = value.callback;

                var currentElement = document.querySelector(selector);
                if (currentElement !== null) {
                  var elementOffset = currentElement.getBoundingClientRect().top + window.pageYOffset;

                  if (windowScroll > elementOffset + offset) {
                    if (value.done !== true) {
                      if (typeof callback === 'string') {
                        var callbackFunc = new Function(callback);
                        callbackFunc();
                      } else if (typeof callback === 'function') {
                        callback();
                      }
                      value.done = true;
                    }
                  }
                }
              }
            }
          }, 100);
        };
      }
    };

    return ScrollfirePatch;
  }(), _class.patched = false, _temp);
});
define('aurelia-materialize-bridge/scrollfire/scrollfire-target',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdScrollfireTarget = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _class, _desc, _value, _class2, _descriptor, _descriptor2;

  var MdScrollfireTarget = exports.MdScrollfireTarget = (_dec = (0, _aureliaTemplating.customAttribute)('md-scrollfire-target'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function MdScrollfireTarget(element) {
    _classCallCheck(this, MdScrollfireTarget);

    _initDefineProp(this, 'callback', _descriptor, this);

    _initDefineProp(this, 'offset', _descriptor2, this);

    this.element = element;
  }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'callback', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'offset', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/scrollfire/scrollfire',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdScrollfire = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _dec2, _class;

  var MdScrollfire = exports.MdScrollfire = (_dec = (0, _aureliaTemplating.customAttribute)('md-scrollfire'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec(_class = _dec2(_class = function () {
    function MdScrollfire(element) {
      _classCallCheck(this, MdScrollfire);

      this.targetId = 0;

      this.element = element;
      this.log = (0, _aureliaLogging.getLogger)('md-scrollfire');
    }

    MdScrollfire.prototype.attached = function attached() {
      var _this = this;

      var targets = $('[md-scrollfire-target]', this.element);
      if (targets.length > 0) {
        (function () {
          _this.log.debug('targets', targets);
          var self = _this;
          var options = [];
          targets.each(function (i, el) {
            var target = $(el);
            if (!target.attr('id')) {
              target.attr('id', 'md-scrollfire-target-' + self.targetId++);
            }
            options.push({
              selector: '#' + target.attr('id'),
              callback: target.get(0).au['md-scrollfire-target'].viewModel.callback,
              offset: parseInt(target.get(0).au['md-scrollfire-target'].viewModel.offset, 10)
            });
          });
          if (options.length > 0) {
            _this.log.debug('configuring scrollFire with these options:', options);
            Materialize.scrollFire(options);
          }
        })();
      }
    };

    return MdScrollfire;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/scrollspy/scrollspy',['exports', 'aurelia-templating', 'aurelia-dependency-injection'], function (exports, _aureliaTemplating, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdScrollSpy = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdScrollSpy = exports.MdScrollSpy = (_dec = (0, _aureliaTemplating.customAttribute)('md-scrollspy'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdScrollSpy(element) {
      _classCallCheck(this, MdScrollSpy);

      _initDefineProp(this, 'target', _descriptor, this);

      this.element = element;
    }

    MdScrollSpy.prototype.attached = function attached() {
      $(this.target, this.element).scrollSpy();
    };

    MdScrollSpy.prototype.detached = function detached() {};

    return MdScrollSpy;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'target', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/select/select',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', 'aurelia-task-queue', 'aurelia-logging', '../common/events', '../common/attributes', 'aurelia-pal'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _aureliaTaskQueue, _aureliaLogging, _events, _attributes, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdSelect = undefined;

  var LogManager = _interopRequireWildcard(_aureliaLogging);

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdSelect = exports.MdSelect = (_dec = (0, _aureliaDependencyInjection.inject)(Element, LogManager, _aureliaBinding.BindingEngine, _aureliaTaskQueue.TaskQueue), _dec2 = (0, _aureliaTemplating.customAttribute)('md-select'), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdSelect(element, logManager, bindingEngine, taskQueue) {
      _classCallCheck(this, MdSelect);

      _initDefineProp(this, 'disabled', _descriptor, this);

      _initDefineProp(this, 'label', _descriptor2, this);

      _initDefineProp(this, 'showErrortext', _descriptor3, this);

      this._suspendUpdate = false;
      this.subscriptions = [];
      this.input = null;
      this.dropdownMutationObserver = null;
      this._taskqueueRunning = false;

      this.element = element;
      this.taskQueue = taskQueue;
      this.handleChangeFromViewModel = this.handleChangeFromViewModel.bind(this);
      this.handleChangeFromNativeSelect = this.handleChangeFromNativeSelect.bind(this);
      this.handleBlur = this.handleBlur.bind(this);
      this.log = LogManager.getLogger('md-select');
      this.bindingEngine = bindingEngine;
    }

    MdSelect.prototype.attached = function attached() {
      var _this = this;

      this.taskQueue.queueTask(function () {
        _this.createMaterialSelect(false);

        if (_this.label) {
          var wrapper = $(_this.element).parent('.select-wrapper');
          var div = $('<div class="input-field"></div>');
          var va = _this.element.attributes.getNamedItem('validate');
          if (va) {
            div.attr(va.name, va.label);
          }
          wrapper.wrap(div);
          $('<label>' + _this.label + '</label>').insertAfter(wrapper);
        }
      });
      this.subscriptions.push(this.bindingEngine.propertyObserver(this.element, 'value').subscribe(this.handleChangeFromViewModel));


      $(this.element).on('change', this.handleChangeFromNativeSelect);
    };

    MdSelect.prototype.detached = function detached() {
      $(this.element).off('change', this.handleChangeFromNativeSelect);
      this.observeVisibleDropdownContent(false);
      this.dropdownMutationObserver = null;
      $(this.element).material_select('destroy');
      this.subscriptions.forEach(function (sub) {
        return sub.dispose();
      });
    };

    MdSelect.prototype.refresh = function refresh() {
      var _this2 = this;

      this.taskQueue.queueTask(function () {
        _this2.createMaterialSelect(true);
      });
    };

    MdSelect.prototype.disabledChanged = function disabledChanged(newValue) {
      this.toggleControl(newValue);
    };

    MdSelect.prototype.showErrortextChanged = function showErrortextChanged() {
      this.setErrorTextAttribute();
    };

    MdSelect.prototype.setErrorTextAttribute = function setErrorTextAttribute() {
      var input = this.element.parentElement.querySelector('input.select-dropdown');
      if (!input) return;
      this.log.debug('showErrortextChanged: ' + this.showErrortext);
      input.setAttribute('data-show-errortext', (0, _attributes.getBooleanFromAttributeValue)(this.showErrortext));
    };

    MdSelect.prototype.notifyBindingEngine = function notifyBindingEngine() {
      this.log.debug('selectedOptions changed', arguments);
    };

    MdSelect.prototype.handleChangeFromNativeSelect = function handleChangeFromNativeSelect() {
      if (!this._suspendUpdate) {
        this.log.debug('handleChangeFromNativeSelect', this.element.value, $(this.element).val());
        this._suspendUpdate = true;
        (0, _events.fireEvent)(this.element, 'change');
        this._suspendUpdate = false;
      }
    };

    MdSelect.prototype.handleChangeFromViewModel = function handleChangeFromViewModel(newValue) {
      this.log.debug('handleChangeFromViewModel', newValue, $(this.element).val());
      if (!this._suspendUpdate) {
        this.createMaterialSelect(false);
      }
    };

    MdSelect.prototype.toggleControl = function toggleControl(disable) {
      var $wrapper = $(this.element).parent('.select-wrapper');
      if ($wrapper.length > 0) {
        if (disable) {
          $('.caret', $wrapper).addClass('disabled');
          $('input.select-dropdown', $wrapper).attr('disabled', 'disabled');
          $wrapper.attr('disabled', 'disabled');
        } else {
          $('.caret', $wrapper).removeClass('disabled');
          $('input.select-dropdown', $wrapper).attr('disabled', null);
          $wrapper.attr('disabled', null);
          $('.select-dropdown', $wrapper).dropdown({ 'hover': false, 'closeOnClick': false });
        }
      }
    };

    MdSelect.prototype.createMaterialSelect = function createMaterialSelect(destroy) {
      this.observeVisibleDropdownContent(false);
      if (destroy) {
        $(this.element).material_select('destroy');
      }
      $(this.element).material_select();
      this.toggleControl(this.disabled);
      this.observeVisibleDropdownContent(true);
      this.setErrorTextAttribute();
    };

    MdSelect.prototype.observeVisibleDropdownContent = function observeVisibleDropdownContent(attach) {
      var _this3 = this;

      if (attach) {
        if (!this.dropdownMutationObserver) {
          this.dropdownMutationObserver = _aureliaPal.DOM.createMutationObserver(function (mutations) {
            var isHidden = false;
            for (var _iterator = mutations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
              var _ref;

              if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
              } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
              }

              var mutation = _ref;

              if (window.getComputedStyle(mutation.target).getPropertyValue('display') === 'none') {
                isHidden = true;
              }
            }
            if (isHidden) {
              _this3.dropdownMutationObserver.takeRecords();
              _this3.handleBlur();
            }
          });
        }
        this.dropdownMutationObserver.observe(this.element.parentElement.querySelector('.dropdown-content'), {
          attributes: true,
          attributeFilter: ['style']
        });
      } else {
        if (this.dropdownMutationObserver) {
          this.dropdownMutationObserver.disconnect();
          this.dropdownMutationObserver.takeRecords();
        }
      }
    };

    MdSelect.prototype.handleBlur = function handleBlur() {
      var _this4 = this;

      if (this._taskqueueRunning) return;
      this._taskqueueRunning = true;
      this.taskQueue.queueTask(function () {
        _this4.log.debug('fire blur event');
        (0, _events.fireEvent)(_this4.element, 'blur');
        _this4._taskqueueRunning = false;
      });
    };

    return MdSelect;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'disabled', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'label', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'showErrortext', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/sidenav/sidenav-collapse',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributes', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributes, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdSidenavCollapse = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdSidenavCollapse = exports.MdSidenavCollapse = (_dec = (0, _aureliaTemplating.customAttribute)('md-sidenav-collapse'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaBinding.ObserverLocator), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdSidenavCollapse(element, observerLocator) {
      _classCallCheck(this, MdSidenavCollapse);

      _initDefineProp(this, 'ref', _descriptor, this);

      this.element = element;
      this.observerLocator = observerLocator;
      this.log = (0, _aureliaLogging.getLogger)('md-sidenav-collapse');
    }

    MdSidenavCollapse.prototype.attached = function attached() {
      var _this = this;

      this.ref.whenAttached.then(function () {

        _this.element.setAttribute('data-activates', _this.ref.controlId);
        var sideNavConfig = {
          edge: _this.ref.mdEdge || 'left',
          closeOnClick: _this.ref.mdFixed ? false : (0, _attributes.getBooleanFromAttributeValue)(_this.ref.mdCloseOnClick),
          menuWidth: parseInt(_this.ref.mdWidth, 10)
        };

        $(_this.element).sideNav(sideNavConfig);
      });
    };

    MdSidenavCollapse.prototype.detached = function detached() {};

    return MdSidenavCollapse;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'ref', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/sidenav/sidenav',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributes', '../common/attributeManager', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributes, _attributeManager, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdSidenav = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _temp;

  var MdSidenav = exports.MdSidenav = (_dec = (0, _aureliaTemplating.customElement)('md-sidenav'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec6 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function MdSidenav(element) {
      var _this = this;

      _classCallCheck(this, MdSidenav);

      _initDefineProp(this, 'mdCloseOnClick', _descriptor, this);

      _initDefineProp(this, 'mdEdge', _descriptor2, this);

      _initDefineProp(this, 'mdFixed', _descriptor3, this);

      _initDefineProp(this, 'mdWidth', _descriptor4, this);

      this.element = element;
      this.controlId = 'md-sidenav-' + MdSidenav.id++;
      this.log = (0, _aureliaLogging.getLogger)('md-sidenav');
      this.whenAttached = new Promise(function (resolve, reject) {
        _this.attachedResolver = resolve;
      });
    }

    MdSidenav.prototype.attached = function attached() {
      this.attributeManager = new _attributeManager.AttributeManager(this.sidenav);
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdFixed)) {
        this.attributeManager.addClasses('fixed');
        if (this.mdEdge === 'right') {
          this.attributeManager.addClasses('right-aligned');
        }
      }

      this.attachedResolver();
    };

    MdSidenav.prototype.detached = function detached() {
      this.attributeManager.removeClasses(['fixed', 'right-aligned']);
    };

    MdSidenav.prototype.mdFixedChanged = function mdFixedChanged(newValue) {
      if (this.attributeManager) {
        if ((0, _attributes.getBooleanFromAttributeValue)(newValue)) {
          this.attributeManager.addClasses('fixed');
        } else {
          this.attributeManager.removeClasses('fixed');
        }
      }
    };

    return MdSidenav;
  }(), _class3.id = 0, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdCloseOnClick', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdEdge', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 'left';
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdFixed', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdWidth', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return 300;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/slider/slider',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributes', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributes, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdSlider = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5;

  var MdSlider = exports.MdSlider = (_dec = (0, _aureliaTemplating.customElement)('md-slider'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.inlineView)('\n  <template class="slider">\n  <require from="./slider.css"></require>\n  <ul class="slides">\n    <slot></slot>\n  </ul>\n  </template>\n'), _dec4 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec5 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec6 = (0, _aureliaTemplating.bindable)(), _dec7 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec8 = (0, _aureliaTemplating.bindable)({ defaultBindingMode: _aureliaBinding.bindingMode.oneTime }), _dec(_class = _dec2(_class = _dec3(_class = (_class2 = function () {
    function MdSlider(element) {
      _classCallCheck(this, MdSlider);

      _initDefineProp(this, 'mdFillContainer', _descriptor, this);

      _initDefineProp(this, 'mdHeight', _descriptor2, this);

      _initDefineProp(this, 'mdIndicators', _descriptor3, this);

      _initDefineProp(this, 'mdInterval', _descriptor4, this);

      _initDefineProp(this, 'mdTransition', _descriptor5, this);

      this.element = element;
      this.log = (0, _aureliaLogging.getLogger)('md-slider');
    }

    MdSlider.prototype.attached = function attached() {
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdFillContainer)) {
        this.element.classList.add('fullscreen');
      }
      this.refresh();
    };

    MdSlider.prototype.pause = function pause() {
      $(this.element).slider('pause');
    };

    MdSlider.prototype.start = function start() {
      $(this.element).slider('start');
    };

    MdSlider.prototype.next = function next() {
      $(this.element).slider('next');
    };

    MdSlider.prototype.prev = function prev() {
      $(this.element).slider('prev');
    };

    MdSlider.prototype.refresh = function refresh() {
      var options = {
        height: parseInt(this.mdHeight, 10),
        indicators: (0, _attributes.getBooleanFromAttributeValue)(this.mdIndicators),
        interval: parseInt(this.mdInterval, 10),
        transition: parseInt(this.mdTransition, 10)
      };
      this.log.debug('refreshing slider, params:', options);
      $(this.element).slider(options);
    };

    MdSlider.prototype.mdIndicatorsChanged = function mdIndicatorsChanged() {
      this.refresh();
    };

    return MdSlider;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdFillContainer', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdHeight', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return 400;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdIndicators', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdInterval', [_dec7], {
    enumerable: true,
    initializer: function initializer() {
      return 6000;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'mdTransition', [_dec8], {
    enumerable: true,
    initializer: function initializer() {
      return 500;
    }
  })), _class2)) || _class) || _class) || _class);
});
define('aurelia-materialize-bridge/switch/switch',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributes', '../common/events'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributes, _events) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdSwitch = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var MdSwitch = exports.MdSwitch = (_dec = (0, _aureliaTemplating.customElement)('md-switch'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec6 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdSwitch(element) {
      _classCallCheck(this, MdSwitch);

      _initDefineProp(this, 'mdChecked', _descriptor, this);

      _initDefineProp(this, 'mdDisabled', _descriptor2, this);

      _initDefineProp(this, 'mdLabelOff', _descriptor3, this);

      _initDefineProp(this, 'mdLabelOn', _descriptor4, this);

      this.element = element;
      this.handleChange = this.handleChange.bind(this);
    }

    MdSwitch.prototype.attached = function attached() {
      this.checkbox.checked = (0, _attributes.getBooleanFromAttributeValue)(this.mdChecked);
      if ((0, _attributes.getBooleanFromAttributeValue)(this.mdDisabled)) {
        this.checkbox.disabled = true;
      }
      this.checkbox.addEventListener('change', this.handleChange);
    };

    MdSwitch.prototype.detached = function detached() {
      this.checkbox.removeEventListener('change', this.handleChange);
    };

    MdSwitch.prototype.handleChange = function handleChange() {
      this.mdChecked = this.checkbox.checked;
      (0, _events.fireEvent)(this.element, 'blur');
    };

    MdSwitch.prototype.blur = function blur() {
      (0, _events.fireEvent)(this.element, 'blur');
    };

    MdSwitch.prototype.mdCheckedChanged = function mdCheckedChanged(newValue) {
      if (this.checkbox) {
        this.checkbox.checked = !!newValue;
      }
    };

    MdSwitch.prototype.mdDisabledChanged = function mdDisabledChanged(newValue) {
      if (this.checkbox) {
        this.checkbox.disabled = !!newValue;
      }
    };

    return MdSwitch;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'mdChecked', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'mdDisabled', [_dec4], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'mdLabelOff', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return 'Off';
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'mdLabelOn', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return 'On';
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/tabs/tabs',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-task-queue', '../common/events', '../common/attributeManager'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaTaskQueue, _events, _attributeManager) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdTabs = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _dec, _dec2, _class;

  var MdTabs = exports.MdTabs = (_dec = (0, _aureliaTemplating.customAttribute)('md-tabs'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element, _aureliaTaskQueue.TaskQueue), _dec(_class = _dec2(_class = function () {
    function MdTabs(element, taskQueue) {
      _classCallCheck(this, MdTabs);

      this.element = element;
      this.taskQueue = taskQueue;
      this.fireTabSelectedEvent = this.fireTabSelectedEvent.bind(this);
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
      this.tabAttributeManagers = [];
    }

    MdTabs.prototype.attached = function attached() {
      var _this = this;

      this.attributeManager.addClasses('tabs');

      var children = this.element.querySelectorAll('li');
      [].forEach.call(children, function (child) {
        var setter = new _attributeManager.AttributeManager(child);
        setter.addClasses(['tab', 'primary-text']);
        _this.tabAttributeManagers.push(setter);
      });

      $(this.element).tabs();
      var childAnchors = this.element.querySelectorAll('li a');
      [].forEach.call(childAnchors, function (a) {
        a.addEventListener('click', _this.fireTabSelectedEvent);
      });
    };

    MdTabs.prototype.detached = function detached() {
      var _this2 = this;

      this.attributeManager.removeClasses('tabs');

      this.tabAttributeManagers.forEach(function (setter) {
        setter.removeClasses('tab');
      });
      this.tabAttributeManagers = [];
      var childAnchors = this.element.querySelectorAll('li a');
      [].forEach.call(childAnchors, function (a) {
        a.removeEventListener('click', _this2.fireTabSelectedEvent);
      });
    };

    MdTabs.prototype.fireTabSelectedEvent = function fireTabSelectedEvent(e) {
      var href = e.target.getAttribute('href');
      (0, _events.fireMaterializeEvent)(this.element, 'selected', href);
    };

    MdTabs.prototype.selectTab = function selectTab(id) {
      $(this.element).tabs('select_tab', id);
      this.fireTabSelectedEvent({
        target: { getAttribute: function getAttribute() {
            return '#' + id;
          } }
      });
    };

    _createClass(MdTabs, [{
      key: 'selectedTab',
      get: function get() {
        var children = this.element.querySelectorAll('li.tab a');
        var index = -1;
        var href = null;
        [].forEach.call(children, function (a, i) {
          if (a.classList.contains('active')) {
            index = i;
            href = a.href;
            return;
          }
        });
        return { href: href, index: index };
      }
    }]);

    return MdTabs;
  }()) || _class) || _class);
});
define('aurelia-materialize-bridge/toast/toastService',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var MdToastService = exports.MdToastService = function () {
    function MdToastService() {
      _classCallCheck(this, MdToastService);
    }

    MdToastService.prototype.show = function show(message, displayLength, className) {
      return new Promise(function (resolve, reject) {
        Materialize.toast(message, displayLength, className, function () {
          resolve();
        });
      });
    };

    return MdToastService;
  }();
});
define('aurelia-materialize-bridge/tooltip/tooltip',['exports', 'aurelia-templating', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _attributeManager, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdTooltip = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4;

  var MdTooltip = exports.MdTooltip = (_dec = (0, _aureliaTemplating.customAttribute)('md-tooltip'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec4 = (0, _aureliaTemplating.bindable)(), _dec5 = (0, _aureliaTemplating.bindable)(), _dec6 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdTooltip(element) {
      _classCallCheck(this, MdTooltip);

      _initDefineProp(this, 'position', _descriptor, this);

      _initDefineProp(this, 'delay', _descriptor2, this);

      _initDefineProp(this, 'html', _descriptor3, this);

      _initDefineProp(this, 'text', _descriptor4, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdTooltip.prototype.bind = function bind() {
      this.html = (0, _attributes.getBooleanFromAttributeValue)(this.html);
    };

    MdTooltip.prototype.attached = function attached() {
      this.attributeManager.addClasses('tooltipped');
      this.attributeManager.addAttributes({ 'data-position': this.position, 'data-tooltip': this.text });
      this.initTooltip();
    };

    MdTooltip.prototype.detached = function detached() {
      $(this.element).tooltip('remove');
      this.attributeManager.removeClasses('tooltipped');
      this.attributeManager.removeAttributes(['data-position', 'data-tooltip']);
    };

    MdTooltip.prototype.textChanged = function textChanged() {
      this.attributeManager.addAttributes({ 'data-tooltip': this.text });
      this.initTooltip();
    };

    MdTooltip.prototype.initTooltip = function initTooltip() {
      $(this.element).tooltip('remove');
      $(this.element).tooltip({
        delay: parseInt(this.delay, 10),
        html: this.html
      });
    };

    return MdTooltip;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'position', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return 'bottom';
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'delay', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return 50;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'html', [_dec5], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'text', [_dec6], {
    enumerable: true,
    initializer: function initializer() {
      return '';
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/transitions/fadein-image',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdFadeinImage = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdFadeinImage = exports.MdFadeinImage = (_dec = (0, _aureliaTemplating.customAttribute)('md-fadein-image'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdFadeinImage(element) {
      _classCallCheck(this, MdFadeinImage);

      _initDefineProp(this, 'ref', _descriptor, this);

      this.element = element;
      this.fadeInImage = this.fadeInImage.bind(this);
      this.log = (0, _aureliaLogging.getLogger)('md-fadein-image');
    }

    MdFadeinImage.prototype.attached = function attached() {
      this.element.addEventListener('click', this.fadeInImage);
      this.ensureOpacity();
    };

    MdFadeinImage.prototype.detached = function detached() {
      this.element.removeEventListener('click', this.fadeInImage);
    };

    MdFadeinImage.prototype.fadeInImage = function fadeInImage() {
      Materialize.fadeInImage($(this.ref));
    };

    MdFadeinImage.prototype.ensureOpacity = function ensureOpacity() {
      var opacity = window.getComputedStyle(this.ref).opacity;
      if (opacity !== 0) {
        this.ref.style.opacity = 0;
      }
    };

    return MdFadeinImage;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'ref', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/transitions/staggered-list',['exports', 'aurelia-templating', 'aurelia-dependency-injection', 'aurelia-logging'], function (exports, _aureliaTemplating, _aureliaDependencyInjection, _aureliaLogging) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdStaggeredList = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var MdStaggeredList = exports.MdStaggeredList = (_dec = (0, _aureliaTemplating.customAttribute)('md-staggered-list'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)(), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdStaggeredList(element) {
      _classCallCheck(this, MdStaggeredList);

      _initDefineProp(this, 'ref', _descriptor, this);

      this.element = element;
      this.staggerList = this.staggerList.bind(this);
      this.log = (0, _aureliaLogging.getLogger)('md-staggered-list');
    }

    MdStaggeredList.prototype.attached = function attached() {
      this.element.addEventListener('click', this.staggerList);
      this.ensureOpacity();
    };

    MdStaggeredList.prototype.detached = function detached() {
      this.element.removeEventListener('click', this.staggerList);
    };

    MdStaggeredList.prototype.staggerList = function staggerList() {
      Materialize.showStaggeredList($(this.ref));
    };

    MdStaggeredList.prototype.ensureOpacity = function ensureOpacity() {
      var items = this.ref.querySelectorAll('li');
      [].forEach.call(items, function (item) {
        var opacity = window.getComputedStyle(item).opacity;
        if (opacity !== 0) {
          item.style.opacity = 0;
        }
      });
    };

    return MdStaggeredList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'ref', [_dec3], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/validation/validationRenderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var MaterializeFormValidationRenderer = exports.MaterializeFormValidationRenderer = function () {
    function MaterializeFormValidationRenderer() {
      _classCallCheck(this, MaterializeFormValidationRenderer);

      this.className = 'md-input-validation';
      this.classNameFirst = 'md-input-validation-first';
    }

    MaterializeFormValidationRenderer.prototype.render = function render(instruction) {
      for (var _iterator = instruction.unrender, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var _ref3 = _ref;
        var error = _ref3.error;
        var elements = _ref3.elements;

        for (var _iterator3 = elements, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref4;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref4 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref4 = _i3.value;
          }

          var element = _ref4;

          this.remove(element, error);
        }
      }
      for (var _iterator2 = instruction.render, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _ref5 = _ref2;
        var error = _ref5.error;
        var elements = _ref5.elements;

        for (var _iterator4 = elements, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
          var _ref6;

          if (_isArray4) {
            if (_i4 >= _iterator4.length) break;
            _ref6 = _iterator4[_i4++];
          } else {
            _i4 = _iterator4.next();
            if (_i4.done) break;
            _ref6 = _i4.value;
          }

          var _element = _ref6;

          this.add(_element, error);
        }
      }
    };

    MaterializeFormValidationRenderer.prototype.add = function add(element, error) {
      switch (element.tagName) {
        case 'MD-INPUT':
          {
            var label = element.querySelector('label');
            var input = element.querySelector('input') || element.querySelector('textarea');
            if (label) {
              label.removeAttribute('data-error');
            }
            if (input) {
              input.classList.remove('valid');
              input.classList.add('invalid');
              error.target = input;
              if (input.hasAttribute('data-show-errortext')) {
                this.addMessage(element, error);
              }
            }
            break;
          }
        case 'SELECT':
          {
            var selectWrapper = element.closest('.select-wrapper');
            if (!selectWrapper) {
              return;
            }
            var _input = selectWrapper.querySelector('input');
            if (_input) {
              _input.classList.remove('valid');
              _input.classList.add('invalid');
              error.target = _input;
              if (!(_input.hasAttribute('data-show-errortext') && _input.getAttribute('data-show-errortext') === 'false')) {
                this.addMessage(selectWrapper, error);
              }
            }
            break;
          }
        case 'INPUT':
          {
            if (element.hasAttribute('md-datepicker')) {
              element.classList.remove('valid');
              element.classList.add('invalid');
              if (!(element.hasAttribute('data-show-errortext') && element.getAttribute('data-show-errortext') === 'false')) {
                this.addMessage(element.parentNode, error);
              }
            }
            break;
          }
        default:
          break;
      }
    };

    MaterializeFormValidationRenderer.prototype.remove = function remove(element, error) {
      switch (element.tagName) {
        case 'MD-INPUT':
          {
            this.removeMessage(element, error);

            var input = element.querySelector('input') || element.querySelector('textarea');
            if (input && element.querySelectorAll('.' + this.className).length === 0) {
              input.classList.remove('invalid');
              input.classList.add('valid');
            }
            break;
          }
        case 'SELECT':
          {
            var selectWrapper = element.closest('.select-wrapper');
            if (!selectWrapper) {
              return;
            }
            this.removeMessage(selectWrapper, error);

            var _input2 = selectWrapper.querySelector('input');
            if (_input2 && selectWrapper.querySelectorAll('.' + this.className).length === 0) {
              _input2.classList.remove('invalid');
              _input2.classList.add('valid');
            }
            break;
          }
        case 'INPUT':
          {
            if (element.hasAttribute('md-datepicker')) {
              this.removeMessage(element.parentNode, error);
              if (element && element.parentNode.querySelectorAll('.' + this.className).length === 0) {
                element.classList.remove('invalid');
                element.classList.add('valid');
              }
            }
            break;
          }
        default:
          break;
      }
    };

    MaterializeFormValidationRenderer.prototype.addMessage = function addMessage(element, error) {
      var message = document.createElement('div');
      message.id = 'md-input-validation-' + error.id;
      message.textContent = error.message;
      message.className = this.className;
      if (element.querySelectorAll('.' + this.className).length === 0) {
        message.className += ' ' + this.classNameFirst;
      }
      message.style.opacity = 0;
      element.appendChild(message, element.nextSibling);
      window.getComputedStyle(message).opacity;
      message.style.opacity = 1;
    };

    MaterializeFormValidationRenderer.prototype.removeMessage = function removeMessage(element, error) {
      var message = element.querySelector('#md-input-validation-' + error.id);
      if (message) {
        element.removeChild(message);
      }
    };

    return MaterializeFormValidationRenderer;
  }();
});
define('aurelia-materialize-bridge/waves/waves',['exports', 'aurelia-templating', 'aurelia-binding', 'aurelia-dependency-injection', '../common/attributeManager', '../common/attributes'], function (exports, _aureliaTemplating, _aureliaBinding, _aureliaDependencyInjection, _attributeManager, _attributes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MdWaves = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var MdWaves = exports.MdWaves = (_dec = (0, _aureliaTemplating.customAttribute)('md-waves'), _dec2 = (0, _aureliaDependencyInjection.inject)(Element), _dec3 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec4 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec5 = (0, _aureliaTemplating.bindable)({
    defaultBindingMode: _aureliaBinding.bindingMode.oneTime
  }), _dec(_class = _dec2(_class = (_class2 = function () {
    function MdWaves(element) {
      _classCallCheck(this, MdWaves);

      _initDefineProp(this, 'block', _descriptor, this);

      _initDefineProp(this, 'circle', _descriptor2, this);

      _initDefineProp(this, 'color', _descriptor3, this);

      this.element = element;
      this.attributeManager = new _attributeManager.AttributeManager(this.element);
    }

    MdWaves.prototype.attached = function attached() {
      var classes = ['waves-effect'];
      if ((0, _attributes.getBooleanFromAttributeValue)(this.block)) {
        classes.push('waves-block');
      }
      if ((0, _attributes.getBooleanFromAttributeValue)(this.circle)) {
        classes.push('waves-circle');
      }
      if (this.color) {
        classes.push('waves-' + this.color);
      }

      this.attributeManager.addClasses(classes);
      Waves.attach(this.element);
    };

    MdWaves.prototype.detached = function detached() {
      var classes = ['waves-effect', 'waves-block'];
      if (this.color) {
        classes.push('waves-' + this.color);
      }

      this.attributeManager.removeClasses(classes);
    };

    return MdWaves;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'block', [_dec3], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'circle', [_dec4], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'color', [_dec5], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class) || _class);
});
define('aurelia-materialize-bridge/config-builder',['exports', './dropdown/dropdown-fix'], function (exports, _dropdownFix) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ConfigBuilder = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var ConfigBuilder = exports.ConfigBuilder = function () {
    function ConfigBuilder() {
      _classCallCheck(this, ConfigBuilder);

      this.useGlobalResources = true;
      this.useScrollfirePatch = false;
      this.globalResources = [];
    }

    ConfigBuilder.prototype.useAll = function useAll() {
      return this.useAutoComplete().useBadge().useBox().useBreadcrumbs().useButton().useCard().useCarousel().useCharacterCounter().useCheckbox().useChip().useCollapsible().useCollection().useColors().useDatePicker().useDropdown().useFab().useFile().useFooter().useInput().useModal().useNavbar().usePagination().useParallax().useProgress().usePushpin().useRadio().useRange().useScrollfire().useScrollSpy().useSelect().useSidenav().useSlider().useSwitch().useTabs().useTooltip().useTransitions().useWaves().useWell();
    };

    ConfigBuilder.prototype.useAutoComplete = function useAutoComplete() {
      this.globalResources.push('./autocomplete/autocomplete');
      return this;
    };

    ConfigBuilder.prototype.useBadge = function useBadge() {
      this.globalResources.push('./badge/badge');
      return this;
    };

    ConfigBuilder.prototype.useBox = function useBox() {
      this.globalResources.push('./box/box');
      return this;
    };

    ConfigBuilder.prototype.useBreadcrumbs = function useBreadcrumbs() {
      this.globalResources.push('./breadcrumbs/breadcrumbs');
      return this;
    };

    ConfigBuilder.prototype.useButton = function useButton() {
      this.globalResources.push('./button/button');
      return this;
    };

    ConfigBuilder.prototype.useCarousel = function useCarousel() {
      this.globalResources.push('./carousel/carousel');
      this.globalResources.push('./carousel/carousel-item');
      return this;
    };

    ConfigBuilder.prototype.useCharacterCounter = function useCharacterCounter() {
      this.globalResources.push('./char-counter/char-counter');
      return this;
    };

    ConfigBuilder.prototype.useCard = function useCard() {
      this.globalResources.push('./card/card');
      return this;
    };

    ConfigBuilder.prototype.useCheckbox = function useCheckbox() {
      this.globalResources.push('./checkbox/checkbox');
      return this;
    };

    ConfigBuilder.prototype.useChip = function useChip() {
      this.globalResources.push('./chip/chip');
      this.globalResources.push('./chip/chips');
      return this;
    };

    ConfigBuilder.prototype.useClickCounter = function useClickCounter() {
      this.globalResources.push('./click-counter');
      return this;
    };

    ConfigBuilder.prototype.useCollapsible = function useCollapsible() {
      this.globalResources.push('./collapsible/collapsible');
      return this;
    };

    ConfigBuilder.prototype.useCollection = function useCollection() {
      this.globalResources.push('./collection/collection');
      this.globalResources.push('./collection/collection-item');
      this.globalResources.push('./collection/collection-header');
      this.globalResources.push('./collection/md-collection-selector');
      return this;
    };

    ConfigBuilder.prototype.useColors = function useColors() {
      this.globalResources.push('./colors/md-colors');
      return this;
    };

    ConfigBuilder.prototype.useDatePicker = function useDatePicker() {
      this.globalResources.push('./datepicker/datepicker');
      return this;
    };

    ConfigBuilder.prototype.useDropdown = function useDropdown() {
      this.globalResources.push('./dropdown/dropdown');
      return this;
    };

    ConfigBuilder.prototype.useDropdownFix = function useDropdownFix() {
      (0, _dropdownFix.applyMaterializeDropdownFix)();
      return this;
    };

    ConfigBuilder.prototype.useFab = function useFab() {
      this.globalResources.push('./fab/fab');
      return this;
    };

    ConfigBuilder.prototype.useFile = function useFile() {
      this.globalResources.push('./file/file');
      return this;
    };

    ConfigBuilder.prototype.useFooter = function useFooter() {
      this.globalResources.push('./footer/footer');
      return this;
    };

    ConfigBuilder.prototype.useInput = function useInput() {
      this.globalResources.push('./input/input');
      this.globalResources.push('./input/input-prefix');
      return this;
    };

    ConfigBuilder.prototype.useModal = function useModal() {
      this.globalResources.push('./modal/modal');
      this.globalResources.push('./modal/modal-trigger');
      return this;
    };

    ConfigBuilder.prototype.useNavbar = function useNavbar() {
      this.globalResources.push('./navbar/navbar');
      return this;
    };

    ConfigBuilder.prototype.usePagination = function usePagination() {
      this.globalResources.push('./pagination/pagination');
      return this;
    };

    ConfigBuilder.prototype.useParallax = function useParallax() {
      this.globalResources.push('./parallax/parallax');
      return this;
    };

    ConfigBuilder.prototype.useProgress = function useProgress() {
      this.globalResources.push('./progress/progress');
      return this;
    };

    ConfigBuilder.prototype.usePushpin = function usePushpin() {
      this.globalResources.push('./pushpin/pushpin');
      return this;
    };

    ConfigBuilder.prototype.useRadio = function useRadio() {
      this.globalResources.push('./radio/radio');
      return this;
    };

    ConfigBuilder.prototype.useRange = function useRange() {
      this.globalResources.push('./range/range');
      return this;
    };

    ConfigBuilder.prototype.useScrollfire = function useScrollfire() {
      this.globalResources.push('./scrollfire/scrollfire');
      this.globalResources.push('./scrollfire/scrollfire-target');
      return this;
    };

    ConfigBuilder.prototype.useScrollSpy = function useScrollSpy() {
      this.globalResources.push('./scrollspy/scrollspy');
      return this;
    };

    ConfigBuilder.prototype.useSelect = function useSelect() {
      this.globalResources.push('./select/select');
      return this;
    };

    ConfigBuilder.prototype.useSidenav = function useSidenav() {
      this.globalResources.push('./sidenav/sidenav');
      this.globalResources.push('./sidenav/sidenav-collapse');
      return this;
    };

    ConfigBuilder.prototype.useSlider = function useSlider() {
      this.globalResources.push('./slider/slider');

      return this;
    };

    ConfigBuilder.prototype.useSwitch = function useSwitch() {
      this.globalResources.push('./switch/switch');
      return this;
    };

    ConfigBuilder.prototype.useTabs = function useTabs() {
      this.globalResources.push('./tabs/tabs');
      return this;
    };

    ConfigBuilder.prototype.useTooltip = function useTooltip() {
      this.globalResources.push('./tooltip/tooltip');
      return this;
    };

    ConfigBuilder.prototype.useTransitions = function useTransitions() {
      this.globalResources.push('./transitions/fadein-image');
      this.globalResources.push('./transitions/staggered-list');
      return this;
    };

    ConfigBuilder.prototype.useWaves = function useWaves() {
      this.globalResources.push('./waves/waves');
      return this;
    };

    ConfigBuilder.prototype.useWell = function useWell() {
      this.globalResources.push('./well/md-well.html');
      return this;
    };

    ConfigBuilder.prototype.withoutGlobalResources = function withoutGlobalResources() {
      this.useGlobalResources = false;
      return this;
    };

    ConfigBuilder.prototype.withScrollfirePatch = function withScrollfirePatch() {
      this.useScrollfirePatch = true;
      return this;
    };

    return ConfigBuilder;
  }();
});
define('aurelia-materialize-bridge/common/polyfills',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.polyfillElementClosest = polyfillElementClosest;
  function polyfillElementClosest() {
    if (typeof Element.prototype.matches !== 'function') {
      Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.webkitMatchesSelector || function matches(selector) {
        var element = this;
        var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
        var index = 0;

        while (elements[index] && elements[index] !== element) {
          ++index;
        }

        return Boolean(elements[index]);
      };
    }

    if (typeof Element.prototype.closest !== 'function') {
      Element.prototype.closest = function closest(selector) {
        var element = this;

        while (element && element.nodeType === 1) {
          if (element.matches(selector)) {
            return element;
          }

          element = element.parentNode;
        }

        return null;
      };
    }
  }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"materialize-css/css/materialize.css\"></require>\n  <div class=\"right-align\" if.bind=\"auth.logged\">\n    <a click.delegate=\"logout()\" class=\"m-b-20 red-text clickable hoverrable\">Logout</a>\n    <!-- <button class=\"m-b-20\" md-button=\"flat:true\">Logout</button> -->\n  </div>\n  <nav>\n    <div class=\"nav-wrapper\">\n      <a href=\"#\" class=\"right brand-logo waves-effect waves-light\">&nbsp;${router.title}</a>\n      <a md-sidenav-collapse=\"ref.bind: sideNav;\" class=\"left hide-on-large-only \" style=\"cursor: pointer; padding: 0 10px;\" data-activates=\"md-sidenav-0\"><i class=\"material-icons\">menu</i></a>\n      <ul class=\"left hide-on-med-and-down\">\n        <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\n          <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\n        </li>\n      </ul>\n      <!-- <ul class=\"side-nav\">\n        <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\n          <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\n        </li>\n      </ul> -->\n      <md-sidenav view-model.ref=\"sideNav\" md-edge=\"left\" md-close-on-click=\"true\">\n        <ul class=\"\">\n          <li repeat.for=\"route of router.navigation\" class=\"${route.isActive ? 'active' : ''}\">\n            <a href.bind=\"route.href\" class=\"waves-effect waves-light\">${route.title}</a>\n          </li>\n        </ul>\n      </md-sidenav>\n    </div>\n  </nav>\n\n\n  <div class=\"page-host\">\n    <router-view></router-view>\n  </div>\n\n</template>\n"; });
define('text!styles/custom.css', ['module'], function(module) { module.exports = "body {\n  font-family: Arial, Helvetica, sans-serif;\n    padding: 20px;\n}\n.w-b{\n\tword-break: break-word;\n}\n\ntable{\n  table-layout: fixed;\n  overflow-x:auto;\n}\n\nth{\n\tcolor:#428bca;\n\tbackground-color: rgba(135, 206, 250, 0.19)\n}\n#titleTxt{\n\tcolor:#428bca;\n}\n.navbar-default .navbar-nav > li > a:hover{\n\n\tcolor:#428bca !important;\n}\n\n.clickable{\n\tcursor:pointer;\n}\n\n.hoverrable:hover{\n  text-decoration: underline;\n}\n\n.no-padding{\n\tpadding:0px;\n}\n.full-width{\n  width:100%;\n}\n\n.m-b-20{\n\tmargin-bottom : 20px;\n}\n.m-t-5{\n\tmargin-top:5px;\n}\n.m-t-10{\n\tmargin-top:10px;\n}\n.m-t-20{\n\tmargin-top:20px;\n}\n.m-l-10{\n\tmargin-left:10px;\n}\n.m-l-20{\n\tmargin-left:20px;\n}\n.m-r-0{\n\tmargin-right:0px;\n}\n\n.p-b-10{\n\tpadding-bottom : 10px;\n}\n.border{\n\tborder : 1px solid red;\n}\n.w-200{\n\twidth:200px;\n}\n.pieChartDiv{\n\theight:400px;\n\tz-index:999999 !important;\n\toverflow:visible !important;\n}\n\n#nowBtn{\n\tposition: absolute;\n\ttop: 372px;\n\tright: 33px;\n}\n\n.truncateCstm {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.bold{\n  font-weight: bold !important;\n}\n"; });
define('text!home.html', ['module'], function(module) { module.exports = "<template>\n  <h2>Welcome ${auth.user.fullName}</h2>\n  <button md-button=\"large: true;\" class=\"waves-effect\" click.delegate=\"logout()\">Logout</button>\n</template>\n"; });
define('text!styles/responsive-table.css', ['module'], function(module) { module.exports = "/* -- import Roboto Font ---------------------------- */\n@import \"https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic&subset=latin,cyrillic\";\n/* -- You can use this tables in Bootstrap (v3) projects. -- */\n/* -- Box model ------------------------------- */\n*,\n*:after,\n*:before {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n}\n/* -- Demo style ------------------------------- */\nhtml,\nbody {\n  position: relative;\n  min-height: 100%;\n  height: 100%;\n}\nhtml {\n  position: relative;\n  overflow-x: hidden;\n  margin: 16px;\n  padding: 0;\n  min-height: 100%;\n  /*font-size: 62.5%;*/\n}\nbody {\n  font-family: 'RobotoDraft', 'Roboto', 'Helvetica Neue, Helvetica, Arial', sans-serif;\n  font-style: normal;\n  font-weight: 300;\n  /*font-size: 1.4rem;*/\n  line-height: 2rem;\n  letter-spacing: 0.01rem;\n  color: #212121;\n  background-color: #f5f5f5;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-rendering: optimizeLegibility;\n}\n#demo {\n  margin: 20px auto;\n  max-width: 960px;\n}\n#demo h1 {\n  font-size: 2.4rem;\n  line-height: 3.2rem;\n  letter-spacing: 0;\n  font-weight: 300;\n  color: #212121;\n  text-transform: inherit;\n  margin-bottom: 1rem;\n  text-align: center;\n}\n#demo h2 {\n  font-size: 1.5rem;\n  line-height: 2.8rem;\n  letter-spacing: 0.01rem;\n  font-weight: 400;\n  color: #212121;\n  text-align: center;\n}\n.shadow-z-1 {\n  -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);\n  -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);\n}\n/* -- Material Design Table style -------------- */\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 2rem;\n  background-color: #fff;\n}\n.table > thead > tr,\n.table > tbody > tr,\n.table > tfoot > tr {\n  -webkit-transition: all 0.3s ease;\n  -o-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n.table > thead > tr > th,\n.table > tbody > tr > th,\n.table > tfoot > tr > th,\n.table > thead > tr > td,\n.table > tbody > tr > td,\n.table > tfoot > tr > td {\n  text-align: left;\n  padding: 1.6rem;\n  vertical-align: top;\n  border-top: 0;\n  -webkit-transition: all 0.3s ease;\n  -o-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n.table > thead > tr > th {\n  font-weight: 400;\n  color: #757575;\n  vertical-align: bottom;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n}\n.table > caption + thead > tr:first-child > th,\n.table > colgroup + thead > tr:first-child > th,\n.table > thead:first-child > tr:first-child > th,\n.table > caption + thead > tr:first-child > td,\n.table > colgroup + thead > tr:first-child > td,\n.table > thead:first-child > tr:first-child > td {\n  border-top: 0;\n}\n.table > tbody + tbody {\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n}\n.table .table {\n  background-color: #fff;\n}\n.table .no-border {\n  border: 0;\n}\n.table-condensed > thead > tr > th,\n.table-condensed > tbody > tr > th,\n.table-condensed > tfoot > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > td {\n  padding: 0.8rem;\n}\n.table-bordered {\n  border: 0;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > tbody > tr > th,\n.table-bordered > tfoot > tr > th,\n.table-bordered > thead > tr > td,\n.table-bordered > tbody > tr > td,\n.table-bordered > tfoot > tr > td {\n  border: 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n.table-bordered > thead > tr > th,\n.table-bordered > thead > tr > td {\n  border-bottom-width: 2px;\n}\n.table-striped > tbody > tr:nth-child(odd) > td,\n.table-striped > tbody > tr:nth-child(odd) > th {\n  background-color: #f5f5f5;\n}\n.table-hover > tbody > tr:hover > td,\n.table-hover > tbody > tr:hover > th {\n  background-color: rgba(0, 0, 0, 0.12);\n}\n@media screen and (max-width: 993px) {\n  .table-responsive-vertical > .table {\n    margin-bottom: 0;\n    background-color: transparent;\n  }\n  .table-responsive-vertical > .table > thead,\n  .table-responsive-vertical > .table > tfoot {\n    display: none;\n  }\n  .table-responsive-vertical > .table > tbody {\n    display: block;\n  }\n  .table-responsive-vertical > .table > tbody > tr {\n    display: block;\n    border: 1px solid #e0e0e0;\n    border-radius: 2px;\n    margin-bottom: 1.6rem;\n  }\n  .table-responsive-vertical > .table > tbody > tr > td {\n    background-color: #fff;\n    display: block;\n    vertical-align: middle;\n    text-align: right;\n  }\n  .table-responsive-vertical > .table > tbody > tr > td[data-title]:before {\n    content: attr(data-title);\n    float: left;\n    font-size: inherit;\n    font-weight: 800;\n    color: #757575;\n  }\n  .table-responsive-vertical.shadow-z-1 {\n    -webkit-box-shadow: none;\n    -moz-box-shadow: none;\n    box-shadow: none;\n  }\n  .table-responsive-vertical.shadow-z-1 > .table > tbody > tr {\n    border: none;\n    -webkit-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);\n    -moz-box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);\n    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.24);\n  }\n  .table-responsive-vertical > .table-bordered {\n    border: 0;\n  }\n  .table-responsive-vertical > .table-bordered > tbody > tr > td {\n    border: 0;\n    border-bottom: 1px solid #e0e0e0;\n  }\n  .table-responsive-vertical > .table-bordered > tbody > tr > td:last-child {\n    border-bottom: 0;\n  }\n  .table-responsive-vertical > .table-striped > tbody > tr > td,\n  .table-responsive-vertical > .table-striped > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical > .table-striped > tbody > tr > td:nth-child(odd) {\n    background-color: #f5f5f5;\n  }\n  .table-responsive-vertical > .table-hover > tbody > tr:hover > td,\n  .table-responsive-vertical > .table-hover > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical > .table-hover > tbody > tr > td:hover {\n    background-color: rgba(0, 0, 0, 0.12);\n  }\n}\n.table-striped.table-mc-red > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-red > tbody > tr:nth-child(odd) > th {\n  background-color: #fde0dc;\n}\n.table-hover.table-mc-red > tbody > tr:hover > td,\n.table-hover.table-mc-red > tbody > tr:hover > th {\n  background-color: #f9bdbb;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-red > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-red > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-red > tbody > tr > td:nth-child(odd) {\n    background-color: #fde0dc;\n  }\n  .table-responsive-vertical .table-hover.table-mc-red > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-red > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-red > tbody > tr > td:hover {\n    background-color: #f9bdbb;\n  }\n}\n.table-striped.table-mc-pink > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-pink > tbody > tr:nth-child(odd) > th {\n  background-color: #fce4ec;\n}\n.table-hover.table-mc-pink > tbody > tr:hover > td,\n.table-hover.table-mc-pink > tbody > tr:hover > th {\n  background-color: #f8bbd0;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-pink > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-pink > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-pink > tbody > tr > td:nth-child(odd) {\n    background-color: #fce4ec;\n  }\n  .table-responsive-vertical .table-hover.table-mc-pink > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-pink > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-pink > tbody > tr > td:hover {\n    background-color: #f8bbd0;\n  }\n}\n.table-striped.table-mc-purple > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-purple > tbody > tr:nth-child(odd) > th {\n  background-color: #f3e5f5;\n}\n.table-hover.table-mc-purple > tbody > tr:hover > td,\n.table-hover.table-mc-purple > tbody > tr:hover > th {\n  background-color: #e1bee7;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-purple > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-purple > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-purple > tbody > tr > td:nth-child(odd) {\n    background-color: #f3e5f5;\n  }\n  .table-responsive-vertical .table-hover.table-mc-purple > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-purple > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-purple > tbody > tr > td:hover {\n    background-color: #e1bee7;\n  }\n}\n.table-striped.table-mc-deep-purple > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-deep-purple > tbody > tr:nth-child(odd) > th {\n  background-color: #ede7f6;\n}\n.table-hover.table-mc-deep-purple > tbody > tr:hover > td,\n.table-hover.table-mc-deep-purple > tbody > tr:hover > th {\n  background-color: #d1c4e9;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-deep-purple > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-deep-purple > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-deep-purple > tbody > tr > td:nth-child(odd) {\n    background-color: #ede7f6;\n  }\n  .table-responsive-vertical .table-hover.table-mc-deep-purple > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-deep-purple > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-deep-purple > tbody > tr > td:hover {\n    background-color: #d1c4e9;\n  }\n}\n.table-striped.table-mc-indigo > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-indigo > tbody > tr:nth-child(odd) > th {\n  background-color: #e8eaf6;\n}\n.table-hover.table-mc-indigo > tbody > tr:hover > td,\n.table-hover.table-mc-indigo > tbody > tr:hover > th {\n  background-color: #c5cae9;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-indigo > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-indigo > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-indigo > tbody > tr > td:nth-child(odd) {\n    background-color: #e8eaf6;\n  }\n  .table-responsive-vertical .table-hover.table-mc-indigo > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-indigo > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-indigo > tbody > tr > td:hover {\n    background-color: #c5cae9;\n  }\n}\n.table-striped.table-mc-blue > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-blue > tbody > tr:nth-child(odd) > th {\n  background-color: #e7e9fd;\n}\n.table-hover.table-mc-blue > tbody > tr:hover > td,\n.table-hover.table-mc-blue > tbody > tr:hover > th {\n  background-color: #d0d9ff;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-blue > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-blue > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-blue > tbody > tr > td:nth-child(odd) {\n    background-color: #e7e9fd;\n  }\n  .table-responsive-vertical .table-hover.table-mc-blue > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-blue > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-blue > tbody > tr > td:hover {\n    background-color: #d0d9ff;\n  }\n}\n.table-striped.table-mc-light-blue > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-light-blue > tbody > tr:nth-child(odd) > th {\n  background-color: #e1f5fe;\n}\n.table-hover.table-mc-light-blue > tbody > tr:hover > td,\n.table-hover.table-mc-light-blue > tbody > tr:hover > th {\n  background-color: #b3e5fc;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-light-blue > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-light-blue > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-light-blue > tbody > tr > td:nth-child(odd) {\n    background-color: #e1f5fe;\n  }\n  .table-responsive-vertical .table-hover.table-mc-light-blue > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-light-blue > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-light-blue > tbody > tr > td:hover {\n    background-color: #b3e5fc;\n  }\n}\n.table-striped.table-mc-cyan > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-cyan > tbody > tr:nth-child(odd) > th {\n  background-color: #e0f7fa;\n}\n.table-hover.table-mc-cyan > tbody > tr:hover > td,\n.table-hover.table-mc-cyan > tbody > tr:hover > th {\n  background-color: #b2ebf2;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-cyan > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-cyan > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-cyan > tbody > tr > td:nth-child(odd) {\n    background-color: #e0f7fa;\n  }\n  .table-responsive-vertical .table-hover.table-mc-cyan > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-cyan > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-cyan > tbody > tr > td:hover {\n    background-color: #b2ebf2;\n  }\n}\n.table-striped.table-mc-teal > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-teal > tbody > tr:nth-child(odd) > th {\n  background-color: #e0f2f1;\n}\n.table-hover.table-mc-teal > tbody > tr:hover > td,\n.table-hover.table-mc-teal > tbody > tr:hover > th {\n  background-color: #b2dfdb;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-teal > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-teal > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-teal > tbody > tr > td:nth-child(odd) {\n    background-color: #e0f2f1;\n  }\n  .table-responsive-vertical .table-hover.table-mc-teal > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-teal > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-teal > tbody > tr > td:hover {\n    background-color: #b2dfdb;\n  }\n}\n.table-striped.table-mc-green > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-green > tbody > tr:nth-child(odd) > th {\n  background-color: #d0f8ce;\n}\n.table-hover.table-mc-green > tbody > tr:hover > td,\n.table-hover.table-mc-green > tbody > tr:hover > th {\n  background-color: #a3e9a4;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-green > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-green > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-green > tbody > tr > td:nth-child(odd) {\n    background-color: #d0f8ce;\n  }\n  .table-responsive-vertical .table-hover.table-mc-green > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-green > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-green > tbody > tr > td:hover {\n    background-color: #a3e9a4;\n  }\n}\n.table-striped.table-mc-light-green > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-light-green > tbody > tr:nth-child(odd) > th {\n  background-color: #f1f8e9;\n}\n.table-hover.table-mc-light-green > tbody > tr:hover > td,\n.table-hover.table-mc-light-green > tbody > tr:hover > th {\n  background-color: #dcedc8;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-light-green > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-light-green > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-light-green > tbody > tr > td:nth-child(odd) {\n    background-color: #f1f8e9;\n  }\n  .table-responsive-vertical .table-hover.table-mc-light-green > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-light-green > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-light-green > tbody > tr > td:hover {\n    background-color: #dcedc8;\n  }\n}\n.table-striped.table-mc-lime > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-lime > tbody > tr:nth-child(odd) > th {\n  background-color: #f9fbe7;\n}\n.table-hover.table-mc-lime > tbody > tr:hover > td,\n.table-hover.table-mc-lime > tbody > tr:hover > th {\n  background-color: #f0f4c3;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-lime > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-lime > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-lime > tbody > tr > td:nth-child(odd) {\n    background-color: #f9fbe7;\n  }\n  .table-responsive-vertical .table-hover.table-mc-lime > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-lime > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-lime > tbody > tr > td:hover {\n    background-color: #f0f4c3;\n  }\n}\n.table-striped.table-mc-yellow > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-yellow > tbody > tr:nth-child(odd) > th {\n  background-color: #fffde7;\n}\n.table-hover.table-mc-yellow > tbody > tr:hover > td,\n.table-hover.table-mc-yellow > tbody > tr:hover > th {\n  background-color: #fff9c4;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-yellow > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-yellow > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-yellow > tbody > tr > td:nth-child(odd) {\n    background-color: #fffde7;\n  }\n  .table-responsive-vertical .table-hover.table-mc-yellow > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-yellow > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-yellow > tbody > tr > td:hover {\n    background-color: #fff9c4;\n  }\n}\n.table-striped.table-mc-amber > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-amber > tbody > tr:nth-child(odd) > th {\n  background-color: #fff8e1;\n}\n.table-hover.table-mc-amber > tbody > tr:hover > td,\n.table-hover.table-mc-amber > tbody > tr:hover > th {\n  background-color: #ffecb3;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-amber > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-amber > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-amber > tbody > tr > td:nth-child(odd) {\n    background-color: #fff8e1;\n  }\n  .table-responsive-vertical .table-hover.table-mc-amber > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-amber > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-amber > tbody > tr > td:hover {\n    background-color: #ffecb3;\n  }\n}\n.table-striped.table-mc-orange > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-orange > tbody > tr:nth-child(odd) > th {\n  background-color: #fff3e0;\n}\n.table-hover.table-mc-orange > tbody > tr:hover > td,\n.table-hover.table-mc-orange > tbody > tr:hover > th {\n  background-color: #ffe0b2;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-orange > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-orange > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-orange > tbody > tr > td:nth-child(odd) {\n    background-color: #fff3e0;\n  }\n  .table-responsive-vertical .table-hover.table-mc-orange > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-orange > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-orange > tbody > tr > td:hover {\n    background-color: #ffe0b2;\n  }\n}\n.table-striped.table-mc-deep-orange > tbody > tr:nth-child(odd) > td,\n.table-striped.table-mc-deep-orange > tbody > tr:nth-child(odd) > th {\n  background-color: #fbe9e7;\n}\n.table-hover.table-mc-deep-orange > tbody > tr:hover > td,\n.table-hover.table-mc-deep-orange > tbody > tr:hover > th {\n  background-color: #ffccbc;\n}\n@media screen and (max-width: 992px) {\n  .table-responsive-vertical .table-striped.table-mc-deep-orange > tbody > tr > td,\n  .table-responsive-vertical .table-striped.table-mc-deep-orange > tbody > tr:nth-child(odd) {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-striped.table-mc-deep-orange > tbody > tr > td:nth-child(odd) {\n    background-color: #fbe9e7;\n  }\n  .table-responsive-vertical .table-hover.table-mc-deep-orange > tbody > tr:hover > td,\n  .table-responsive-vertical .table-hover.table-mc-deep-orange > tbody > tr:hover {\n    background-color: #fff;\n  }\n  .table-responsive-vertical .table-hover.table-mc-deep-orange > tbody > tr > td:hover {\n    background-color: #ffccbc;\n  }\n}\n"; });
define('text!debug/debug.html', ['module'], function(module) { module.exports = "<template>\n  <form>\n    <md-input md-type=\"time\" md-label=\"Start Time\" md-value.bind=\"startTime & validate\"></md-input>\n    <button md-waves type=\"submit\" click.delegate=\"validate()\">Save</button>\n    ${controller.errors.length}\n    <ul if.bind=\"controller.errors\">\n      <li repeat.for=\"error of controller.errors\">\n        ${error.message}\n      </li>\n    </ul>\n  </form>\n</template>\n"; });
define('text!login/login.html', ['module'], function(module) { module.exports = "<template>\n  <md-card class=\"container\" if.bind=\"!auth.logged\">\n    <h3 class=\"center\">Please login to access the application</h3>\n    <form submit.delegate=\"tryLogin()\">\n      <md-card md-title=\"Login\" class=\"container\">\n        <div>\n          <md-input md-type=\"text\" md-label=\"Login\" md-value.bind=\"userLogin\"></md-input>\n        </div>\n      </md-card>\n      <md-card md-title=\"Password\" class=\"container\">\n        <div>\n          <md-input md-type=\"password\" md-label=\"password\" md-value.bind=\"password\"></md-input>\n        </div>\n      </md-card>\n      <div class=\"rigt\">\n        <button md-button=\"large: true\" type=\"submit\" class=\"\">Login</button>\n      </div>\n    </form>\n  </md-card>\n  <md-card md-title class=\"center container\" if.bind=\"auth.logged\">\n    <h3>You are already logged in</h3>\n    <div class=\"button-row\">\n      <button md-button=\"large: true;\" class=\"waves-effect\" click.delegate=\"logout()\">Logout</button>\n    </div>\n  </md-card>\n</template>\n"; });
define('text!worktime/grid.html', ['module'], function(module) { module.exports = "<template><!-- Display a list of the worktime -->\n\t<div class=\"m-t-20\">\n\t\t<div class=\"row\">\n\t  \t<button type='button' md-waves title=\"Add a Work Time\" click.delegate=\"addWorkTime()\" class=\"btn-large btn-primary no-print right\">ADD</button>\n\t\t\t<!-- <h4>Temps de travail de ${userName} pour ${clientName}<span ng-show=\"gridCtrl.showDates\"> du ${from | dateFormat : 'DD.MM.YYYY'} au ${to | dateFormat : 'DD.MM.YYYY'}</span></h4> -->\n\t  </div>\n\t\t<div class=\"\">\n\t\t\t<div class=\"table-responsive-vertical shadow-z-1\">\n  <!-- Table starts here -->\n  \t\t\t<table id=\"table\" class=\"table table-hover table-mc-light-blue\">\n\t\t\t\t\t<thead>\n\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t<th>Start</th>\n\t\t\t\t\t\t\t<th>End</th>\n\t\t\t\t\t\t\t<th>Duration</th>\n\t\t\t\t\t\t\t<!-- <th class=\"comment\" width=\"\">Comment</th> -->\n\t\t\t\t\t\t\t<th>Client</th>\n\t\t\t\t\t\t\t<th>Category</th>\n\t\t\t\t\t\t\t<th>User</th>\n\t\t\t\t\t\t\t<th>Break</th>\n\t\t\t\t\t\t\t<th>Reason</th>\n\t\t\t\t\t\t\t<th>Train Time</th>\n\t\t\t\t\t\t\t<th>Train Price</th>\n\t\t\t\t\t\t\t<th class=\"no-print\"></th>\n\t\t\t\t\t\t\t<th class=\"no-print\"></th>\n\t\t\t\t\t\t</tr>\n\t\t\t\t\t</thead>\n\t\t\t\t\t<tbody repeat.for=\"worktime of worktimes.entities\">\n\t\t\t\t\t\t\t<tr class=\"clickable\">\n\t\t\t\t\t\t\t\t<td data-title=\"Start\">${worktime.start | dateFormat:'DD.MM.YY HH:mm'}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"End\">${worktime.end | dateFormat:'DD.MM.YY HH:mm'}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"Duration\">${worktime.timeWorked | millisToHours}</td>\n\t\t\t\t\t\t\t\t<!-- <td data-title=\"Comment\" class=\"w-b comment\">${worktime.comment}</td> -->\n\t\t\t\t\t\t\t\t<td data-title=\"Client\">${worktime.clientName}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"Category\">${worktime.categoryName}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"User\">${worktime.userName}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"Break Time\" class=\"\">${worktime.breakTime}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"Reason\">${worktime.breakReason | truncate:25}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"Train Time\" class=\"\">${worktime.trainTime}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"Train Price\" class=\"\">${worktime.trainPrice}</td>\n\t\t\t\t\t\t\t\t<td data-title=\"\" click.delegate=\"editTime(worktime.ID)\" class=\"no-print center-align\"><span title=\"Edit\" class=\"material-icons \">edit</span></td>\n\t\t\t\t\t\t\t\t<td data-title=\"\" click.delegate=\"deleteTime(worktime.ID)\" class=\"no-print center-align\"><span title=\"Delete\" class=\"material-icons\">delete</span></td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t<tr class=\"clickable\">\n\t\t\t\t\t\t\t\t<td class=\"hide-on-med-and-down\"><b>Comment</b></td>\n\t\t\t\t\t\t\t\t<td colspan=\"11\" data-title=\"Comment\" class=\"w-b comment\">${worktime.comment}</td>\n\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t<!-- <tr class=\"clickable\" repeat.for=\"worktime of worktimes.entities\">\n\t\t\t\t\t\t\t<td data-title=\"Start\">${worktime.start | dateFormat:'DD.MM.YY HH:mm'}</td>\n\t\t\t\t\t\t\t<td data-title=\"End\">${worktime.end | dateFormat:'DD.MM.YY HH:mm'}</td>\n\t\t\t\t\t\t\t<td data-title=\"Duration\">${worktime.timeWorked | millisToHours}</td>\n\t\t\t\t\t\t\t<td data-title=\"Comment\" class=\"w-b comment\">${worktime.comment}</td>\n\t\t\t\t\t\t\t<td data-title=\"Break\" class=\"\">${worktime.breakTime}</td>\n\t\t\t\t\t\t\t<td data-title=\"Reason\" class=\"truncateCstm\">${worktime.breakReason | truncate:25}</td>\n\t\t\t\t\t\t\t<td data-title=\"Break\" class=\"\">${worktime.trainTime}</td>\n\t\t\t\t\t\t\t<td data-title=\"Break\" class=\"\">${worktime.trainPrice}</td>\n\t\t\t\t\t\t\t<td data-title=\"Client\" class=\"truncateCstm\">${worktime.clientName}</td>\n\t\t\t\t\t\t\t<td data-title=\"Category\" class=\"truncatseCstm\">${worktime.categoryName}</td>\n\t\t\t\t\t\t\t<td data-title=\"User\" class=\"truncateCstm\">${worktime.userName}</td>\n\t\t\t\t\t\t\t<td data-title=\"\" click.delegate=\"editTime(worktime.ID)\" class=\"no-print center-align\"><span title=\"Edit\" class=\"material-icons \">edit</span></td>\n\t\t\t\t\t\t\t<td data-title=\"\" click.delegate=\"deleteTime(worktime.ID)\" class=\"no-print center-align\"><span title=\"Delete\" class=\"material-icons\">delete</span></td>\n\t\t\t\t\t\t</tr> -->\n\t\t\t\t\t</tbody>\n\t\t\t\t</table>\n\t\t\t</div>\n\t\t\t<!-- <button class=\"full-width waves-effect btn no-print\" click.delegate=\"worktimes.more()\" show.bind=\"worktimes._sent < worktimes._count\"><span class=\"material-icons\">add</span></button> -->\n\n\t\t\t<md-pagination class=\"center-align\" md-show-first-last=\"true\" md-show-prev-next=\"true\" md-on-page-changed.delegate=\"pageChanged($event)\" md-pages.bind=\"paginationPages\" md-visible-page-links=\"2\">\n\t\t\t</md-pagination>\n\n\t\t\t<!-- <md-switch md-checked.bind=\"showFirstLast\"></md-switch>\n\t\t\t<md-pagination class=\"center-align\" md-show-first-last.two-way=\"showFirstLast\" md-show-first-last=\"0\" md-pages=\"5\" md-visible-page-links=\"3\" md-active-page=\"1\"></md-pagination>\n\t\t</div>\n\t\t<div class=\"container\">\n\t\t\t<div class=\"progress\">\n\t\t\t\t<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"{{gridCtrl.collValueNow}}\" aria-valuemin=\"0\" aria-valuemax=\"{{gridCtrl.collValueMax}}\" style=\"width: {{gridCtrl.collValuePercent}}%;\">\n\t\t\t\t\t <span>60% Complete</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</div> -->\n\t</div>\n</template>\n"; });
define('text!worktime/w-form.html', ['module'], function(module) { module.exports = "<template>\n  <a class=\"btn-floating btn-large waves-effect waves-light m-t-20\" click.delegate=\"navigateBack()\"><i class=\"material-icons\">navigate_before</i></a>\n  <div class=\"container m-t-20\">\n    <form submit.delegate=\"save()\">\n      <div class=\"row\">\n        <div class=\"col s6\">\n          <h4 class=\"header\">Edit</h4>\n        </div>\n        <div class=\"col s6 right-align\">\n          <button type=\"submit\" md-waves class=\"btn-floating\"><i class=\"material-icons\">save</i></button>\n        </div>\n      </div>\n      <md-card md-title=\"Client\">\n        <div class=\"row\">\n          <div class=\"col s12 m6\">\n            <select md-select=\"label: Client\" value.two-way=\"selectedClient & validate\" md-select.ref=\"clientSelect\">\n              <option value=\"\" disabled selected>Select a client...</option>\n              <option repeat.for=\"client of clients\" value.bind=\"client.ID\">${client.name}</option>\n            </select>\n          </div>\n          <div class=\"col s12 m6\">\n            <select md-select=\"disabled.bind: disableCategorySelect; label: Category\" value.two-way=\"selectedCategory & validate\" md-select.ref=\"categorySelect\">\n              <option value=\"\" disabled selected>Select a category...</option>\n              <option repeat.for=\"category of categories\" value.bind=\"category.ID\">${category.name}</option>\n            </select>\n          </div>\n        </div>\n      </md-card>\n      <md-card md-title=\"Time\">\n        <div class=\"row\">\n          <div class=\"col s12\">\n            <label class=\"active\">Different end date :</label>\n            <md-switch md-checked.bind=\"endDateDifferent\" md-label-on=\"Yes\" md-label-off=\"No\"></md-switch>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col ${endDateDifferent ? 's6 m3' : 's12 m6'} input-field\">\n            <label for=\"startDate\" class=\"active\">Start Date</label>\n            <input id=\"startDate\" md-datepicker=\"container: body; value.bind: startDate & validate;'\" type=\"date\" placeholder=\"Start Date\" />\n          </div>\n          <div class=\"col s6 ${endDateDifferent ? 'm3' : 'hide'} input-field\">\n            <label for=\"endDate\" class=\"active\">End Date</label>\n            <input id=\"endDate\" md-datepicker=\"container: body; value.two-way: endDate;'\" type=\"date\" placeholder=\"End Date\" />\n          </div>\n          <div class=\"col s6 m3\">\n            <md-input md-type=\"time\" md-label=\"Start Time\" md-value.bind=\"startTime & validate\"></md-input>\n          </div>\n          <div class=\"col s6 m3\">\n            <md-input md-type=\"time\" md-label=\"End Time\" md-value.bind=\"endTime & validate\"></md-input>\n          </div>\n        </div>\n      </md-card>\n      <md-card md-title=\"Informations\">\n        <div class=\"row\">\n          <div class=\"col s12\">\n            <md-input md-label=\"Comment\" md-value.bind=\"comment & validate\" validate=\"comment\" md-text-area=\"true\"></md-input>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col s12\">\n            <label class=\"active\">Break</label>\n            <md-switch md-checked.bind=\"showBreak\" md-label-on=\"Yes\" md-label-off=\"No\"></md-switch>\n          </div>\n        </div>\n        <div class=\"row ${showBreak ? '' : 'hide'}\">\n          <div class=\"col s12 m3\">\n            <md-input md-type=\"time\" md-label=\"Break Time\" md-value.bind=\"breakTime\"></md-input>\n          </div>\n          <div class=\"col s12 m9\">\n            <md-input md-label=\"Break Reason\" md-value.bind=\"breakReason & validate\"></md-input>\n          </div>\n        </div>\n        <div class=\"row\">\n          <div class=\"col s12\">\n            <label class=\"active\">Train</label>\n            <md-switch md-checked.bind=\"showTrain\" md-label-on=\"Yes\" md-label-off=\"No\"></md-switch>\n          </div>\n        </div>\n        <div class=\"row ${showTrain ? '' : 'hide'}\">\n          <div class=\"col s6\">\n            <md-input md-type=\"time\" md-label=\"Train Time\" md-value.bind=\"trainTime\"></md-input>\n          </div>\n          <div class=\"col s6\">\n            <md-input md-type=\"number\" md-step=\"any\" md-label=\"Train Price\" md-validate=\"true\" md-validate-error=\"invalid number\" md-value.bind=\"trainPrice\"></md-input>\n          </div>\n        </div>\n      </md-card>\n    </form>\n  </div>\n</template>\n"; });
define('text!worktime/worktimeSection.html', ['module'], function(module) { module.exports = "<template>\n  <router-view></router-view>\n</template>\n"; });
define('text!resources/elements/datePicker.html', ['module'], function(module) { module.exports = "<template>\n  <label for.bind=\"dpid\">${dplabel}</label>\n  <input id.bind=\"dpid\" type=\"date\" class=\"datepicker\" value.bind=\"dpdate | dateFormat: 'YYYY-MM-DD'\" />\n</template>\n"; });
define('text!resources/elements/navBar.html', ['module'], function(module) { module.exports = "<template>\n  <header class=\"container full-width no-padding\">\n    <nav class=\"navbar navbar-default\">\n      <div class=\"container-fluid\">\n\n      \t<div class=\"navbar-header\">\n\n      \t\t<button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\".collapse\" aria-expanded=\"\">\n      \t\t\t<span class=\"sr-only\">Toggle navigation</span>\n      \t\t\t<span class=\"icon-bar\"></span>\n      \t\t\t<span class=\"icon-bar\"></span>\n      \t\t\t<span class=\"icon-bar\"></span>\n      \t\t</button>\n      \t\t<a id=\"titleTxt\" class=\"navbar-brand\" href=\"#\">Worktime</a>\n      \t</div>\n      \t<div class=\"navbar-collapse collapse\">\n      \t\t<div ng-controller=\"tabs as tabCtrl\">\n      \t\t\t<ul class=\"nav navbar-nav\">\n      \t\t\t\t<li><a route-href=\"route: home\">Home<span class=\"sr-only\">(current)</span></a></li>\n      \t\t\t\t<li><a route-href=\"route: worktime\">WorkTime</a></li>\n      \t\t\t\t<li><a>Clients</a></li>\n      \t\t\t\t<li ng-class=\"{'active':tabCtrl.isActive('category')}\" ng-click=\"tabCtrl.setActive('category')\"><a ui-sref=\"app.categories\">Categories</a></li>\n      \t\t\t\t<li ng-class=\"{'active':tabCtrl.isActive('report')}\" ng-click=\"tabCtrl.setActive('report')\"><a ui-sref=\"app.report\">Report</a></li>\n      \t\t\t</ul>\n      \t\t</div>\n      \t\t<login></login>\n      \t</div>\n      </div><!-- /.container-fluid -->\n    </nav>\n  </header>\n</template>\n"; });
define('text!resources/elements/pagination.html', ['module'], function(module) { module.exports = "<template>\n  <ul class=\"pagination\">\n    <li class=\"disabled\"><a href=\"#!\"><i class=\"material-icons\">chevron_left</i></a></li>\n    <li class=\"active\"><a href=\"#!\">1</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">2</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">3</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">4</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\">5</a></li>\n    <li class=\"waves-effect\"><a href=\"#!\"><i class=\"material-icons\">chevron_right</i></a></li>\n  </ul>\n</template>\n"; });
//# sourceMappingURL=app-bundle.js.map