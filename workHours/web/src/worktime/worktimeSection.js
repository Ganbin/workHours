/**
* The shell for the orders section of the application.  Will contain either
* the order-list or order page.
*/
export class worktimeSection {
    configureRouter(config, router) {
        config.map([
            { route: '',    moduleId: './grid', nav: false, title: '' },
            { route: '/add', moduleId: './w-form',      nav: false, title: '' },
            { route: ':id', moduleId: './w-form',      nav: false, title: '' }
        ]);
    }
}
