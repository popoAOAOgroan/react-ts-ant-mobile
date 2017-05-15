import React from 'react';
import PropTypes from 'prop-types'; 

import 'ASSET/scss/doctor/doctorCellBox.scss';

export default class DoctorCellBox extends React.Component {
  componentWillMount() {
  }
  componentDidMount() {
  }
  render() {
    let _data = this.props.data;
    return (
      <div className="doctor-cell-box">
        <p>
          <span>上海西郊骨科医院</span>
          <span className="doctor-cell-box__vaildate doctor-cell-box__vaildate-yes"><i className="iconfont myzd-bd-renzhengshibai"></i>已认证</span>
        </p>
        <div className="doctor-cell-box__info">
          <div className="doctor__user-avatar"></div>
          <div className="doctor-cell-box__info-right">
            <p><span className="doctor-cell-box__name">小田田</span>
              <i className="iconfont myzd-bd-weirenzheng myzd-bd-weirenzheng--no-active"></i>
              <i className="doctor-cell-box__icon-45d">45天</i>
            </p>
            <p><span className="doctor-cell-box__title">神经外科</span></p>
            <p><span className="doctor-cell-box__title">副主任医师</span><span>讲师</span></p>
          </div>
          <i className="iconfont myzd-bd-dianhua"></i>
        </div>
      </div>
    );
  }
};

DoctorCellBox.propTypes = {
  data: PropTypes.object,
  key: PropTypes.number // mine or other
};

