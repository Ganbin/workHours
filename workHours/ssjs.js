"use strict";

loginByPassword('ganbin','1234');
var workTimes = ds.WorkTime.all(),i,catObj={};

workTimes.compute('break','categoryName').toArray({'break':{sum:true}});

workTimes.distinctValues('categoryName');
//workTimes

var categoryNames = workTimes.distinctValues('categoryName'); // List of all the categories
categoryNames.forEach(function (category){
	catObj[category] = {'time':0,'price':0,'addPrice':0,'trainTime':0};
});

workTimes.forEach(function (workTime){
		catObj[workTime.categoryName].time += ((workTime.end - workTime.start)-workTime['break'])/1000/60; // Compute the time for each category in minute.
		catObj[workTime.categoryName].price += (((workTime.end - workTime.start)-workTime['break'])/1000/60/60)*workTime.categoryPriceHour; // Compute the time for each category in minute.
		catObj[workTime.categoryName].addPrice += workTime.trainPrice; // Compute the time for each category in minute.
		catObj[workTime.categoryName].trainTime += workTime.trainTime/1000/60; // Compute the time for each category in minute.
});
catObj
var from = new Date('2016'),to = new Date('2017');
ds.Client.getReport({from:from,to:to});