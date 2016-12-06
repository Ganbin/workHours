import {bindable, bindingMode, inject, observable, NewInstance} from 'aurelia-framework';
import {ValidationRules, ValidationController} from 'aurelia-validation';
import {MaterializeFormValidationRenderer, MdToastService } from 'aurelia-materialize-bridge';
import {WakandaClient} from 'wakanda-client';
import {Auth} from 'services/Auth';
import env from 'services/env';

const hostname = env.hostname;
const wakanda = new WakandaClient(`http://${hostname}:8081`);

@inject(Element, NewInstance.of(ValidationController), Auth)
export class Filter {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) FFrom = new Date();
    @bindable({ defaultBindingMode: bindingMode.twoWay }) FTo = new Date();
    @bindable({ defaultBindingMode: bindingMode.twoWay }) FClientName = 'all';
    @bindable({ defaultBindingMode: bindingMode.twoWay }) FUserId;
    customDate = false;
    @observable rangeSelection;
    @observable allClients = false;
    clients = [];
    users = [];
    showUsers = false;

    constructor(element, validationController, auth) {
        this.element = element;
        this.validationController = validationController;
        this.validationController.addRenderer(new MaterializeFormValidationRenderer());
        this.auth = auth;
    }

    attached() {
        wakanda.getCatalog().then((ds) => {
            this.ds = ds; // Bind ds for a use in method of the class
            ds.Client.query({filter: 'ID >= 0'}).then((clients) => {
                this.clients = clients.entities;
                this.clientSelect.refresh();
            });

            if (this.auth.isAdmin) { // Only show the user list if the logged user is a dataAdmin
                this.showUsers = true;
                ds.User.query({filter: 'ID >= 0'}).then((users) => {
                    this.users = users.entities;
                    this.userSelect.refresh();
                    if (this.auth.isAdmin) {
                        this.showUsers = true;
                    } else {
                        this.showUsers = false;
                        this.FUserId = this.users[0].userID;
                    }
                });
            } else { // else, only request the report for the current user
                this.showUsers = false;
                this.FUserId = this.auth.user.ID;
            }
        });
        this.thisMonth(); // Initialize the default range to this month

        if (this.FClientName === 'all') {
            this.allClients = true;
        }
    }

    applyFilter() {
        this.validationController.validate().then(v => {
            if (v.length === 0) {
                const user = this.users.find((userItem) => {
                    return userItem.userID === this.FUserId;
                });
                const event = new CustomEvent('apply', {
                    bubbles: true,
                    detail: {userName: user.fullName}
                });

                /*
                 * This wil trigger the submit event delegated to the custom filter element
                 */
                this.element.dispatchEvent(event);

                document.querySelector('#filterHeader').click();
            }
        });
    }

    thisMonth() {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);

        this.FFrom = firstDay;
        this.FTo = lastDay;
    }

    lastMonth() {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const firstDay = new Date(y, m - 1, 1);
        const lastDay = new Date(y, m, 0);

        this.FFrom = firstDay;
        this.FTo = lastDay;
    }

    thisYear() {
        const today = new Date();
        const y = today.getFullYear();
        const firstDay = new Date(y, 0, 1);
        const lastDay = new Date(y + 1, 0, 0);

        this.FFrom = firstDay;
        this.FTo = lastDay;
    }

    rangeSelectionChanged(newValue, oldValue) {
        switch (newValue) {
        case 'thisMonth' :
            this.thisMonth();
            break;
        case 'lastMonth' :
            this.lastMonth();
            break;
        case 'thisYear' :
            this.thisYear();
            break;
        default:
            break;
        }
    }

    allClientsChanged(newValue, oldValue) {
        if (newValue) {
            this.FClientName = 'all';
        } else {
            this.FClientName = '';
        }
        this.clientSelect.refresh();
    }
}

ValidationRules
    .ensure('FFrom').displayName('From')
        .required()
    .ensure('FTo').displayName('To')
        .required()
    .ensure('FUserId').displayName('User')
        .required()
    .ensure('FClientName').displayName('Client')
        .required()
    .on(Filter);
