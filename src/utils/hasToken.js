import queryParam from 'UTIL/base/queryParam';
import AppStorage from 'CONFIG/AppStorage'
import jsrsasign from 'UTIL/jsrsasign/jws';
import env from 'CONFIG/envs';

/**
 * 用户访问权限拦截器
 * @export {Function} onEnter，详见以下文档：
 * https://github.com/reactjs/react-router/blob/master/docs/API.md#onEnter
 */

export default function hasToken(nextState, replace, next) {
	let _token = queryParam.getQueryParam(window.location.href, 'token');
	if (_token) {
		// alert(_token);
        let tokenJson = jsrsasign.jws.JWS.parse(_token);
        let lastLogin = new Date(tokenJson.payloadObj.iat * 1000).toISOString();
        let expire = parseInt(tokenJson.payloadObj.exp, 10) - parseInt(tokenJson.payloadObj.iat, 10);
        
		AppStorage.TOKEN_STORAGE.putItem('Authorization',_token);
        AppStorage.TOKEN_STORAGE.putItem('expire', expire); //hardcode
        AppStorage.TOKEN_STORAGE.putItem('lastLogin', lastLogin); //hardcode
	}

	let token = AppStorage.TOKEN_STORAGE.getItem('Authorization');
    let expire = AppStorage.TOKEN_STORAGE.getItem('expire');
    let lastLogin = AppStorage.TOKEN_STORAGE.getItem('lastLogin');
    
    let now = new Date();
    let last = new Date(lastLogin);
    if (!token || !expire || !lastLogin) {  
        window.location.href = queryParam.setQueryParam(env.static.login, {
            r: window.location.href
        });
    }
    else if ((now.getTime() - last.getTime()) > expire * 1000) {  
        window.location.href = queryParam.setQueryParam(env.static.login, {
            r: window.location.href
        });
    }
    else{
    	next();
    }
}
