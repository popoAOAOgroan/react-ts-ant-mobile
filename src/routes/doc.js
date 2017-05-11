
export default {
  path: 'doc',
  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {
        // cb(null, require('COMPONENT/doc/other.js').default);
        cb(null, require('COMPONENT/screen/doc/index.tsx').default);

      }, 'doc');
    }
  }
};
