import AppStorage from 'CONFIG/AppStorage';
import env from 'CONFIG/envs';
import queryParam from 'UTIL/base/queryParam';

let signOut = (redirectUrl, stay) => {
    AppStorage.TOKEN_STORAGE.removeItem('Authorization');
    AppStorage.TOKEN_STORAGE.removeItem('expire');
    AppStorage.TOKEN_STORAGE.removeItem('lastLogin');
    AppStorage.USER_STORAGE.removeItem('userInfo');
    let queryToken = queryParam.getQueryParam(decodeURIComponent(redirectUrl), 'token');
    if (queryToken) {
        redirectUrl = queryParam.removeQueryParam(redirectUrl, 'token');
    }
    window.location.href = queryParam.setQueryParam(env.static.login, {
        r: redirectUrl || '',
        type: 'signOut',
        stay: stay ? true : false
    });
};
export default signOut;
