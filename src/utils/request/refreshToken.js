import AppStorage from 'CONFIG/AppStorage';
import HttpRequest from 'UTIL/request';
import env from 'CONFIG/envs';
import queryParam from 'UTIL/base/queryParam';
import jsrsasign from 'UTIL/jsrsasign/jws';

const API_URL = env.login_api;
let baseToDo = {
    successDo: (res) => {
        return res;
    },
    errorDo: (res) => {
        // maybe you could dialog the res.message
        return res;
    }
};
let rService = (params) => {
    return HttpRequest.post({
        url: API_URL + '/api/login/refresh',
        params: params
    }, baseToDo);
};
let RefreshToken = () => {
    // get the url token and update
    let urlToken = queryParam.getQueryParam(window.location.href, 'token');
    if (urlToken) {
        AppStorage.TOKEN_STORAGE.putItem('Authorization', urlToken);
        let payload = JSON.parse(jsrsasign.jws.JWS.parse(urlToken).payloadPP);
        let lastLogin = new Date(payload.iat * 1000).toISOString();
        let expire = parseInt(payload.exp, 10) - parseInt(payload.iat, 10);
        AppStorage.TOKEN_STORAGE.putItem('lastLogin', lastLogin);
        AppStorage.TOKEN_STORAGE.putItem('expire', expire);
    }
    let promise = new Promise((resolve, reject) => {
        let token = AppStorage.TOKEN_STORAGE.getItem('Authorization');
        let expire = AppStorage.TOKEN_STORAGE.getItem('expire');
        let lastLogin = AppStorage.TOKEN_STORAGE.getItem('lastLogin');
        let now = new Date();
        let last = new Date(lastLogin);
        if (!token || !expire || !lastLogin) {
            reject({
                code: 1010403,
                message: 'No login.'
            });
        }
        if ((now.getTime() - last.getTime()) > expire * 1000) {
            reject({
                code: 1010402,
                message: 'Long time no operate.'
            });
        } else {
            if ((expire * 1000 - (now.getTime() - last.getTime())) < 5 * 60 * 1000) {
                rService({
                    token: token
                }).then((res) => {
                    AppStorage.TOKEN_STORAGE.putItem('Authorization', res.data.token);
                    AppStorage.TOKEN_STORAGE.putItem('expire', res.data.expire);
                    AppStorage.TOKEN_STORAGE.putItem('lastLogin', res.data.userInfo.lastLogin);
                    AppStorage.USER_STORAGE.putItem('userInfo', res.data.userInfo);
                    resolve({
                        code: 1000000,
                        message: 'ok'
                    });
                }, (res) => {
                    reject({
                        code: 1010401,
                        message: 'refresh token error.'
                    });
                });
            } else {
                resolve({
                    code: 1000000,
                    message: 'ok'
                });
            }
        }
    });
    return promise;
};
export default RefreshToken;