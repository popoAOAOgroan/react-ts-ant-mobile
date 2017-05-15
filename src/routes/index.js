// import {
//   injectReducer
// } from 'REDUCER'
// import createContainer from 'UTIL/createContainer'

// import queryParam from 'UTIL/base/queryParam'
// import AppStorage from 'CONFIG/AppStorage'
// import jsrsasign from 'UTIL/jsrsasign/jws';

/**
 * 当应用加载时，监测url中token参数。如果存在则缓存当前token，并做去除token的redirect跳转
 */
// let urlToken = queryParam.getQueryParam(window.location.href, 'token');
// if (urlToken) {
//   AppStorage.TOKEN_STORAGE.putItem('Authorization', urlToken);
//   let payload = JSON.parse(jsrsasign.jws.JWS.parse(urlToken).payloadPP);
//   let lastLogin = new Date(payload.iat * 1000).toISOString();
//   let expire = parseInt(payload.exp, 10) - parseInt(payload.iat, 10);
//   AppStorage.TOKEN_STORAGE.putItem('lastLogin', lastLogin);
//   AppStorage.TOKEN_STORAGE.putItem('expire', expire);
//   window.location.href = queryParam.removeQueryParam(window.location.href, 'token');
// }

export default {
  path: '/bd',

  component: require('COMPONENT/App').default,

  // indexRoute: {
  //   component: require('COMPONENT/App').default
  // },

  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {

        cb(null, require('COMPONENT/screen/ProfileScreen.js').default);

      }, 'bd_center');
    }
    // onEnter: hasToken
  },


  childRoutes: [
    // require('./doc').default,
    require('./team').default,
    require('./doctor').default,
    
    // 强制“刷新”页面的 hack
    {
      path: 'redirect',
      component: require('COMPONENT/Redirect').default
    },

    // 无路由匹配的情况一定要放到最后，否则会拦截所有路由
    {
      path: '*',
      component: require('COMPONENT/404').default
    }
  ]
};

/*
 当前路由树如下
 ├ /
 |
 ├ /msg
 ├ /msg/add
 ├ /msg/detail/:msgId
 ├ /msg/modify/:msgId
 |
 ├ /todo
 |
 ├ /redirect
 */