import {WakandaClient} from 'wakanda-client';
import {AppRouter} from 'aurelia-router';
import {inject, observable, NewInstance} from 'aurelia-framework';
import {ValidationRules, ValidationController} from 'aurelia-validation';
import { MaterializeFormValidationRenderer, MdToastService } from 'aurelia-materialize-bridge';
import {Auth} from 'services/Auth';
import moment from 'moment';
import env from 'services/env';

const hostname = env.hostname;
const port = env.port;
const wakanda = new WakandaClient(`http://${hostname}:${port}`);

// TODO : Integrate the material-datetime-picker library

@inject(AppRouter, NewInstance.of(ValidationController), Auth, MdToastService)
export class WForm {
    worktime;
    clients;
    categories;
    disableCategorySelect = true;
    @observable() selectedClient = '';
    selectedCategory = '';
    getEntity;
    edition;

    endDateDifferent = false;

    startDate = new Date();
    endDate = new Date();
    startTime = moment().format('HH:mm');
    endTime = moment().format('HH:mm');

    breakTime;
    trainTime;

    showBreak = false;
    showTrain = false;

    constructor(router, validationController, auth, toast) {
        this.router = router;
        this.validationController = validationController;
        this.validationController.addRenderer(new MaterializeFormValidationRenderer());
        this.auth = auth;
        this.toast = toast;
    }

    activate(params) {
        this.ID = params.id;
    }

    bind() {

    }

    attached() {
        wakanda.getCatalog().then((ds) => {
            this.ds = ds; // Bind ds for a use in method of the class

            /**
             * Get the entity from the server with the given ID
             * @param  {number} ID ID of the worktime to get
             * @return {null}    No return
             */
            this.getEntity = (ID) => {
                ds.WorkTime.find(ID).then((worktime) => {
                    this.worktime = worktime;
                    this.selectedClient = worktime.client._key;
                    this.clientSelect.refresh();

                    this.startDate = new Date(worktime.start);
                    this.endDate = new Date(worktime.end);
                    this.startTime = moment(worktime.start).format('HH:mm');
                    this.endTime = moment(worktime.end).format('HH:mm');

                    this.breakTime = worktime.breakTime;
                    this.trainTime = worktime.trainTime;

                    this.comment = worktime.comment;
                    this.breakReason = worktime.breakReason;
                    this.trainPrice = worktime.trainPrice;

                    if (moment(this.startDate).format('YYYYMMDD') !== moment(this.endDate).format('YYYYMMDD')) {
                        this.endDateDifferent = true;
                    }

                    if (worktime.breakTime !== '' && worktime.breakTime !== '00:00' && worktime.breakTime !== null && worktime.breakTime !== 0 && worktime.breakTime !== undefined) {
                        this.showBreak = true;
                    }
                    if ((worktime.trainTime !== '' && worktime.trainTime !== '00:00' && worktime.trainTime !== null && worktime.trainTime !== 0 && worktime.trainTime !== undefined) ||
                        (worktime.trainPrice !== '' && worktime.trainPrice !== null && worktime.trainPrice !== undefined && worktime.trainPrice !== 0)) {
                        this.showTrain = true;
                    }
                }).catch((err) => {
                });
            };

            ds.Client.query({filter: 'ID >= 0'}).then((clients) => {
                this.clients = clients.entities;
                this.clientSelect.refresh();
            });

            if (this.ID) {
                this.edition = true;
                this.getEntity(this.ID);
            } else {
                this.edition = false;
                this.worktime = ds.WorkTime.create();
            }
        }).catch((err) => {
        });
    }

    save() {
        this.validationController.validate().then(v => {
            if (v.valid) {
                this.ds.Client.query({
                    filter: 'ID = :1',
                    params: [this.selectedClient]
                }).then((evt) => {
                    this.worktime.client = evt.entities[0];
                    this.ds.Category.query({
                        filter: 'ID = :1',
                        params: [this.selectedCategory]
                    }).then((evt2) => {
                        this.worktime.category = evt2.entities[0];
                        this.worktime.start = (moment(this.startDate).hour(this.startTime.substr(0, 2)).minute(this.startTime.substr(3, 2)).second(0).millisecond(0))._d;
                        this.worktime.end = (moment(this.endDate).hour(this.endTime.substr(0, 2)).minute(this.endTime.substr(3, 2)).second(0).millisecond(0))._d;
                        this.worktime.comment = this.comment;

                        if (this.showBreak) {
                            this.worktime.breakTime = this.breakTime;
                            this.worktime.breakReason = this.breakReason;
                        }

                        if (this.showTrain) {
                            this.worktime.trainTime = this.trainTime;
                            this.worktime.trainPrice = this.trainPrice;
                        }
                        this.worktime.save().then((evt3) => {
                            if (this.edition) {
                                this.toast.show('Entity edited!', 5000, 'green bold');
                            } else {
                                this.toast.show('Entity saved!', 5000, 'green bold');
                                this.toast.show('You can create a new time', 5000, 'green bold');
                                this.worktime = this.ds.WorkTime.create();
                            }
                        });
                    });
                });
            } else {
                this.toast.show('Check the errors.', 5000, 'red bold');
            }
        });
    }


    navigateBack() {
        this.router.navigateBack();
    }

    selectedClientChanged() {
        let clientID = this.worktime.client && this.worktime.client._key && this.worktime.client._key && this.selectedClient === undefined ? this.worktime.client._key : this.selectedClient;
        this.disableCategorySelect = false;
        this.ds && this.ds.Category.query({filter: 'client.ID == :1', params: [clientID]}).then((result) => {
            this.categories = result.entities;
            if (this.categories.length === 1) {
                this.selectedCategory = this.categories[0].ID;
            } else {
                this.selectedCategory = '';
            }
            if (this.worktime.category !== null) {
                this.selectedCategory = this.worktime.category._key;
            }
            this.categorySelect.refresh();
        });
    }
}
ValidationRules
    .ensure('selectedClient').displayName('Client')
        .required()
    .ensure('selectedCategory').displayName('Category')
        .required()
    .ensure('startDate')
        .required()
    .ensure('startTime')
        .required()
    .ensure('endTime')
        .required()
    .ensure('comment')
        .required()
    .on(WForm);
