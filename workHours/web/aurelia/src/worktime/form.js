import {WakandaClient} from "wakanda-client";
import {AppRouter} from 'aurelia-router';

const wakanda = new WakandaClient('http://127.0.0.1:8081');

export function Form(router) {
    //const self = this;
    this.router = router;
    this.activate = (params) => {
        this.ID = params.id;
        wakanda.getCatalog().then((ds) => {
            /**
             * Get the entity from the server with the given ID
             * @param  {number} ID ID of the worktime to get
             * @return {null}    No return
             */
            this.getEntity = (ID) => {
                ds.WorkTime.find(ID).then((worktime) => {
                    this.worktime = worktime;
                    console.log('test',worktime);
                }).catch((err) => {
                });
            };

            this.getEntity(this.ID);
        });
    };

    this.navigateBack = () => {
        this.router.navigateBack();
    };
}

Form.inject = [AppRouter];
