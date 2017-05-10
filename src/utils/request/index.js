import 'whatwg-fetch';
import env from 'CONFIG/envs';
import refreshToken from 'REQUEST/refreshToken';
import AppStorage from 'CONFIG/AppStorage';
import queryParam from 'UTIL/base/queryParam';

let defaults = {
    method: 'GET',
    headers: {
        'Authorization': AppStorage.TOKEN_STORAGE.getItem('Authorization') ? AppStorage.TOKEN_STORAGE.getItem('Authorization') : '',
        'content-type': 'application/json'
    },
    credentials: 'same-origin',
    ignoreAuthorization: false
};
// if (env.envName === 'mock') {
//     delete defaults.headers.Authorization
// }
let getToDoObj = function (todo) {
    if (typeof todo === 'undefined') {
        return {
            successDo: (res) => {
                return res;
            },
            errorDo: (res) => {
                return res;
            }
        };
    }
    if (typeof todo === 'function') {
        return {
            successDo: todo,
            errorDo: todo
        };
    }
    if (typeof todo === 'object') {
        return {
            successDo: todo.successDo,
            errorDo: todo.errorDo
        };
    }
};

let goToLogin = () => {
    window.location.href = queryParam.setQueryParam(env.static.login, {
        r: window.location.href
    });
};
let doRequest = (url, options, todoObj) => {
    let promise = new Promise((resolve, reject) => {
        if (!options.ignoreAuthorization) {
            refreshToken().then((res) => {
                // after refresh update the authorization
                options.headers.Authorization = AppStorage.TOKEN_STORAGE.getItem('Authorization');
                // console.log('??',options.headers.Authorization);
                fetch(url, options).then(
                    (response) => {
                        if (response.ok) {
                            response.json().then((data) => {
                                if (data.code == 1000000) {
                                    resolve(todoObj.successDo(data));
                                } else {
                                    if (data.code == 1211006) { // || data.code == '无效'
                                        goToLogin();
                                    }
                                    reject(todoObj.errorDo(data));
                                }
                            }, (error) => {
                                reject(todoObj.errorDo({
                                    code: 1099001,
                                    message: 'Fetch to json error',
                                    data: error.message
                                }));
                            });
                        } else {
                            reject(todoObj.errorDo({
                                code: 1099002,
                                message: 'Fetch response is not ok.',
                                data: response
                            }));
                        }
                    },
                    (error) => {
                        reject(todoObj.errorDo({
                            code: 1099003,
                            message: 'Fetch to server error.',
                            data: error.message
                        }));
                    }
                ).catch(error => {
                    reject(todoObj.errorDo({
                        code: 1099004,
                        message: 'Fetch error.',
                        data: error.message
                    }));
                });
            }, (res) => {
                // TODO alert tips & redirect to the login
                goToLogin();
            });
        } else {
            delete options.headers.Authorization;
            fetch(url, options).then(
                (response) => {
                    if (response.ok) {
                        response.json().then((data) => {
                            if (data.code == 1000000) {
                                resolve(todoObj.successDo(data));
                            } else {
                                if (data.code == '过期' || data.code == '无效') {
                                    goToLogin();
                                }
                                reject(todoObj.errorDo(data));
                            }
                        }, (error) => {
                            reject(todoObj.errorDo({
                                code: 1099001,
                                message: 'Fetch to json error',
                                data: error.message
                            }));
                        });
                    } else {
                        response.json().then((data) => {
                            reject(todoObj.errorDo(data));
                        }, (error) => {
                            reject(todoObj.errorDo({
                                code: 1099001,
                                message: 'Fetch to json error',
                                data: error
                            }));
                        });
                    }
                },
                (error) => {
                    reject(todoObj.errorDo({
                        code: 1099003,
                        message: 'Fetch to server error.',
                        data: error.message
                    }));
                }
            ).catch(error => {
                reject(todoObj.errorDo({
                    code: 1099004,
                    message: 'Fetch error.',
                    data: error.message
                }));
            });
        }
    });
    return promise;
};
let HttpRequest = {
    post: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'POST';
        if (!options.body) {
            options.body = JSON.stringify(requestObj.params);
        }
        let url = requestObj.url;
        return doRequest(url, options, getToDoObj(todo));
    },
    put: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'PUT';
        if (!options.body) {
            options.body = JSON.stringify(requestObj.params);
        }
        let url = requestObj.url;
        return doRequest(url, options, getToDoObj(todo));
    },
    get: (requestObj, todo, opts) => {
        let options = Object.assign({}, defaults);
        Object.assign(options, opts);
        options.method = 'GET';
        let url = requestObj.url;
        let keys = Object.keys(requestObj.params);
        for (var i = 0; i < keys.length; i++) {
            let currentKey = keys[i];
            if (i === 0 && url.indexOf('?') != -1) {
                url = url + '&' + currentKey + '=' + requestObj.params[currentKey];
            } else {
                url = url + (i === 0 ? '?' : '&') + currentKey + '=' + requestObj.params[currentKey];
            }
        }
        return doRequest(url, options, getToDoObj(todo));
    }
};
export default HttpRequest;
