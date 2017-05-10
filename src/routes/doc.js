
export default {
  path: 'doc',
  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('COMPONENT/doc/index').default);
      }, 'doc');
    }
  }
};
