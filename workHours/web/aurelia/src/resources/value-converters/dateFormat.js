import moment from 'moment';

export class DateFormatValueConverter {
  toView(value, format) {
     //  debugger;
    return moment(value).format(format);
  }
}
