
export default {
  path: 'doctors',

  component: require('COMPONENT/App').default,

  indexRoute: {
    getComponent(nextState, cb) {
      require.ensure([], (require) => {

        cb(null, require('COMPONENT/screen/DoctorListScreen.js').default);

      }, 'doctor_list');
    }
  }
};
