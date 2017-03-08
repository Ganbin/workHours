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

      if (localStorage.getItem('reportOptions') != null) {
        this.message = localStorage.getItem('reportMessage');
        let options = JSON.parse(localStorage.getItem('reportOptions'));

        options.from = new Date(options.from);
        options.to = new Date(options.to);
        this.from = options.from;
        this.to = options.to;
        this.clientName = options.clientName;
        this.userID = parseInt(options.userID, 10);
        this.getReport(options);
      }
    });
  }

  getReport(options) {
    this.ds.Client.getReport(options).then((evt) => {
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

  applyFilter($event) {
    // Here we gonna get the submit event from the filter custom element
    const userName = $event.detail.userName;
    this.message = `Work report of ${userName} for ${this.clientName === 'all' ? 'all clients' : this.clientName} from ${moment(this.from).format('DD.MM.YYYY')} to ${moment(this.to).format('DD.MM.YYYY')}`;

    const options = {from: this.from, to: this.to, clientName: this.clientName, userID: this.userID};

    localStorage.setItem('reportOptions', JSON.stringify(options));
    localStorage.setItem('reportMessage', this.message);

    this.getReport(options);
  }
}
