
export default {
  path: 'team',

  component: require('COMPONENT/App').default,

  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {

        cb(null, require('COMPONENT/screen/TeamScreen.js').default);

      }, 'team_list');
    }
  }
};
