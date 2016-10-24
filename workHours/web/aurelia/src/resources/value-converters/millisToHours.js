export class MillisToHoursValueConverter {
    toView(millis) {
        if (millis === undefined) {
            return '0';
        }
        let date;
        const minutes = millis / 1000 / 60;
        date = (((Math.floor(millis / 60)) < 10) ? ('0' + (Math.floor(minutes / 60))) : (Math.floor(minutes / 60))) + ':' + (((minutes % 60) < 10) ? ('0' + (minutes % 60)) : (minutes % 60));
        return date;
    }
}
