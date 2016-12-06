export default {hostname: window.location.hostname};

const datas = {routeRequest: 'home'}; // Default route request set to home

/**
 * Set a value for a key in the `datas` object
 * @param {String} name  the name of the key to affect a value
 * @param {Any} value the value we want to store
 */
let setData = function (name, value) {
    datas[name] = value;
};

export {datas, setData};
