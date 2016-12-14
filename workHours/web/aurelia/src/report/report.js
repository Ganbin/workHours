import {WakandaClient} from 'wakanda-client';
import {inject} from 'aurelia-framework';
import env from 'services/env';
import moment from 'moment';

const hostname = env.hostname;
const port = env.port;
const wakanda = new WakandaClient(`http://${hostname}:${port}`);

export class Report {
    from;
    to;
    clientName = 'all';
    userID = '';
    message = '';

    constructor() {
    }

    attached() {
        wakanda.getCatalog().then((ds) => {
            this.ds = ds; // Bind ds for a use in method of the class
        });
    }

    apply($event) {
        // Here we gonna get the submit event from the filter custom element
        const userName = $event.detail.userName;
        this.message = `Work report of ${userName} for ${this.clientName === 'all' ? 'all clients' : this.clientName} from ${moment(this.from).format('DD.MM.YYYY')} to ${moment(this.to).format('DD.MM.YYYY')}`;

        this.ds.Client.getReport({from: this.from, to: this.to, clientName: this.clientName, userID: this.userID}).then((evt) => {
            this.reportData = [];
            for (const cat in evt) {
                this.reportData.push({'name': cat,
                    'time': evt[cat].time,
                    'price': evt[cat].price,
                    'addPrice': evt[cat].addPrice,
                    'trainTime': evt[cat].trainTime,
                    'label': evt[cat].label
                });
            }
        });
    }
}
