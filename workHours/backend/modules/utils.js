/* Convert an array with only one level into an array valid for synchronizing with a local datasource type array
 * This because the datasource need a attribute name for each entry in the array
 * Example : ['value1',value2'] become --> [{'attributeName' : 'value1'},{'attributeName' : 'value2'}]
 */
exports.arrayToDatasource = function(array,attributeName){
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
exports.datasourceToArray = function(dataSource,attributeName){
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
exports.findInArray = function(array,value,attributeName,getObject){
	
	var array2;
	if(array instanceof Array && array.length > 0){
		if(typeof array[0] === 'object'){
			array2 = this.datasourceToArray(array,attributeName);
		}else{
			array2 = array;
		}
		if(array2.indexOf(value+'') === -1 && array2.indexOf(value) === -1){
			return false;
		}else{
			if(getObject){
				if(array2.indexOf(value+'') !== -1){
					return array[array2.indexOf(value+'')];
				}
				if(array2.indexOf(value) !== -1){
					return array[array2.indexOf(value)];
				}
			}else{
				return true;
			}
		}
	}else{
		return false;
	}
};