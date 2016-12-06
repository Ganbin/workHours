/* eslint-disable */
/*
* Client-Side Utility Module.
*/

export default function utils() {
	this.baseURL = 'http://' + window.location.host + '/'; // the base URL

	/*
	 * Round a number after the decimal
	 * Params : number to round,
	 *			nbDecimal : 2-4.
	*/
	this.round = function(number,nbDecimal){
		var returnNb;
		switch(nbDecimal){
			case 1:
				returnNb = Math.round(number*10)/10;
				break;
			case 2:
				returnNb = Math.round(number*100)/100;
				break;
			case 3:
				returnNb = Math.round(number*1000)/1000;
				break;
			case 4:
				returnNb = Math.round(number*10000)/10000;
				break;
		}
		return returnNb;
	};

	/*
	 * This method get the value of a parameter in the url.
	 * Params : name : name of the attribute to get
	 *			getAll <bool>: If true, return an array of all the parameters
	 */
	this.getURLAttribute = function(name,getAll){
		var result = getAll === true ? {} : "Not found",
			tmp = [];
		location.search
			.substr(1)
			.split("&")
			.forEach(function (item) {
				if(getAll !== true){
					tmp = item.split("=");
					if(tmp[0] === name){
						result = decodeURIComponent(tmp[1]);
					}
				}else{
					tmp = item.split("=");
					result[tmp[0]] = tmp[1];
				}
	    });
	    return result;
	};

	// Add the number of days to the date.
	this.addDays = function(date,days) {
	    date.setDate(date.getDate() + parseInt(days,10));
	    return date;
	};

	this.toUTCDate = function (date){
		var utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
		return utc;
	};

	this.millisToUTCDate = function (millis){
		return this.toUTCDate(new Date(millis));
	};

	/*
	 * Check if the DST is the same.
	 * params :
	 * 			date : date to check
	 * 			getOffset <bool> : true if we want to get the offset
	 */
	this.checkDST = function (date,getOffset) {
		var result;
		getOffset = getOffset == null ? false : getOffset;

		if(new Date().getTimezoneOffset() === date.getTimezoneOffset()){
			result = true;
		}else{
			result = false;
		}
		if(getOffset){
			return date.getTimezoneOffset();
		}else{
			return result;
		}
	};

	/**
	 * This method will select the text inside a element
	 *
	 */
	this.selectText = function(element) {
		var text = element,
		range, selection;

		if(document.body.createTextRange){
			range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		}else if(window.getSelection){
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	};

	/*
	 * This method is a fix to give to the sort function to sort the number.
	 */
	this.compare_entiers_func = function(a,b){
		// Elle doit retourner :
		// -1 si a < b
		//  0 si a = b
		//  1 si a > b
		return parseInt(a,10) - parseInt(b,10);
	}

	// Return the size of an object
	this.size = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};


	/*
	 * Generate an unique ID based on custom rules.
	 */
	this.generateUUID = function(){
	    var d = new Date().now();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	        var r = (d + Math.random()*16)%16 | 0;
	        d = Math.floor(d/16);
	        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	    });
	    return uuid;
	};

	this.isDataAdmin = function(){
		return waf.directory.currentUserBelongsTo('DataAdmin');
	};

	/**
	 * This method will map the collection inside an array then we can retreive the entity by giving the ID to the index of the array.
	 */
	this.map = function(collection){
		var colMap = []
		collection.forEach(function(col){colMap[col.ID]=col});
		return colMap;
	};

	/* Convert an array with only one level into an array valid for synchronizing with a local datasource type array
	 * This because the datasource need a attribute name for each entry in the array
	 * Example : ['value1',value2'] become --> [{'attributeName' : 'value1'},{'attributeName' : 'value2'}]
	 */
	this.arrayToDatasource = function(array,attributeName){
		var returnDatasource = [],
		i;
		for(i=0;i<array.length;i++){
			returnDatasource[i] = {};
			returnDatasource[i][attributeName] = array[i];
		}

		return returnDatasource;
	};

	/* Convert a datasource local array into a one level array
	 * Example : [{'attributeName' : 'value1'},{'attributeName' : 'value2'}] become --> ['value1',value2']
	 */
	this.datasourceToArray = function(dataSource,attributeName){
		var returnArray = [],
		i;

		for(i=0;i<dataSource.length;i++){
			returnArray[i] = dataSource[i][attributeName];
		}

		return returnArray;
	};

	/* This function allow you to search for a value in a one dimension array
	 * array : array where we need to search.
	 * value : the value we want to search.
	 * attributeName : the name of the attribute to search if we use a datasource array.(then we will just convert the datasource array in a simple array)
	 * getObject : optional if true, we return the element in the array.
	 */
	this.findInArray = function(array,value,attributeName,getObject){
		var array2;
		if(array instanceof Array && array.length > 0){
			if(typeof array[0] === 'object'){
				array2 = this.datasourceToArray(array,attributeName);
			}else{
				array2 = array;
			}
			if(array2.indexOf(value) === -1){
				return false;
			}else{
				if(getObject){
					return array[array2.indexOf(value)];
				}else{
					return true;
				}
			}
		}else{
			return false;
		}
	};

	/*
	 * This method return the difference between two array.
	 */
	this.arrayDiff = function(a1,a2) {

		  var a=[], diff=[];
	  for(var i=0;i<a1.length;i++)
	    a[a1[i]]=true;
	  for(var i=0;i<a2.length;i++)
	    if(a[a2[i]]) delete a[a2[i]];
	    else a[a2[i]]=true;
	  for(var k in a)
	    diff.push(k);
	  return diff;

		//return a.filter(function(i) {return b.indexOf(i) < 0;});
	};

	/*
	 * This method return an arry which include all the value which are in the two arrays.
	 */
	this.getSameValues = function(arr1,arr2){
		var i,j,
			returnArray=[];
		for(i=0;i<arr1.length;i++){
			for(j=0;j<arr2.length;j++){
				if(arr1[i] === arr2[j]){
					returnArray.push(arr1[i]);
					break;
				}
			}
		}
		return returnArray;
	};

	/****************************************************************/

	this.isURL = function(url){
		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return regexp.test(url);
	};

	// This method is usefull to check the password safety and display a feedback message
	// Params : pwd : the password
	//			feedback : id of the feedback widget
	//			safetypwd : id of the feedback image widget
	this.check_password_safety=function(pwd,feedback,safetypwd){

		var msg = "";
		var points = pwd.length;
		var password_info = document.getElementById(feedback);

		var has_letter		= new RegExp("[a-z]");
		var has_caps		= new RegExp("[A-Z]");
		var has_numbers		= new RegExp("[0-9]");
		var has_symbols		= new RegExp("\\W");

		if(has_letter.test(pwd)) 	{ points += 4; }
		if(has_caps.test(pwd)) 		{ points += 4; }
		if(has_numbers.test(pwd)) 	{ points += 4; }
		if(has_symbols.test(pwd)) 	{ points += 4; }


		if( points >= 24 ) {
			msg = '<span style="color: #0f0;">Your password is strong!</span>';
			$$(safetypwd).setValue('/images/002_35.png');
			$$(safetypwd).show();
		} else if( points >= 16 ) {
			msg = '<span style="color: #81BEF7;">Your password is medium!</span>';
			$$(safetypwd).setValue('/images/002_36.png');
			$$(safetypwd).show();
		} else if( points >= 12 ) {
			msg = '<span style="color: #fa0;">Your password is weak!</span>';
			$$(safetypwd).setValue('/images/002_37.png');
			$$(safetypwd).show();
		} else {
			msg = '<span style="color: red;">Your password is very weak!</span>';
			$$(safetypwd).setValue('/images/002_38.png');
			$$(safetypwd).show();
		}

		password_info.innerHTML = msg ;
	};

	// This method calculate the password entropy
	this.check_password_entropy = function(password) {
		var alphabet = 0, lower = false, upper = false, numbers = false, symbols1 = false, symbols2 = false, other = '', c ;

		for(var i = 0; i < password.length; i++) {
			c = password[i];
			if(!lower && 'abcdefghijklmnopqrstuvwxyz'.indexOf(c) >= 0) {
				alphabet += 26;
				lower = true;
			}
			else if(!upper && 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(c) >= 0) {
				alphabet += 26;
				upper = true;
			}
			else if(!numbers && '0123456789'.indexOf(c) >= 0) {
				alphabet += 10;
				numbers = true;
			}
			else if(!symbols1 && '!@#$%^&*()'.indexOf(c) >= 0) {
				alphabet += 10;
				symbols1 = true;
			}
			else if(!symbols2 && '~`-_=+[]{}\|;:",.<>?'+"'".indexOf(c) >= 0) {
				alphabet += 22;
				symbols2 = true;
			}
			else if(other.indexOf(c) === -1) {
				alphabet += 1;
				other += c;
			}
		}

		if(password.length === 0) return 0;
		var entropy = password.length * Math.log(alphabet) / Math.log(2);
		return (Math.round(entropy * 100) / 100) + ' bits';

	};

	// This method will return the original size of an image.
	this.getImageOriginalSize = function(imgSrc) {
	    var newImg = new Image();

	    return new Promise(function(resolve,refuse){
	    	newImg.onload = function() {
				var height = newImg.height;
				var width = newImg.width;
				resolve({height:height,width:width});
			}
			newImg.src = imgSrc; // this must be done AFTER setting onload
		});
	};

	this.getNavigatorLanguage = function(){
		var language = navigator.language;

		if(language.length === 2){
			return language;
		}else if(language.length === 4){
			return language.substr(0,2);
		}
	};
}
