export class MinutesToHoursValueConverter {
  toView(minutes) {
      var date = (((Math.floor(minutes/60)) < 10) ? ("0" + (Math.floor(minutes/60))) : (Math.floor(minutes/60))) + ':' + (((minutes%60) < 10) ? ("0" + (minutes%60)) : (minutes%60));
      return date;
  }
}
