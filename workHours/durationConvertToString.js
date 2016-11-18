/**
 * This method will convert a duration to a `HH:mm` format string
 * This is due to a change in the model. The breakTime and trainTime are now
 * string attribute when they were duration. I do this because it is more simple
 * to process a formated string than a duration. This way I don't need to deal with
 * `Date` object when I just need a 24h time.
 * 
 * This file have to be run one time only to convert an old version.
 */
 
 
loginByPassword('ganbin','1234');

function convert(duration) {
	var min = (parseInt(duration) / 1000) / 60;
	
	if (duration === null){
		return '00:00';
	}

	if (typeof min !== 'number') {
		return 'Not a number';
	}

	return min < 60 ?
			'00:' + (min < 10 ? '0' + Math.floor(min) : Math.floor(min)) :
			(Math.floor(min / 60) < 10 ?
				'0' + (Math.floor(min / 60)) + ':' + ((min % 60) < 10 ? '0' + Math.floor(min % 60) : Math.floor(min % 60)) :
				Math.floor(min / 60) + ':' + (min % 60 < 10 ? '0' + Math.floor(min % 60) : Math.floor(min % 60)));
}

ds.WorkTime.all().forEach(function (worktime) {
	if (typeof worktime.break === 'number') {
		worktime.breakTime = convert(worktime.break);
	} else {
		worktime.breakTime = '00:00';
	}
	if (typeof worktime.trainTime === 'number') {
		worktime.trainTime = convert(worktime.trainTime);
	} else {
		worktime.trainTime = '00:00';
	}
	try{
		worktime.save();
	} catch (e) {
		debugger;
	}
});

ds.WorkTime.all()