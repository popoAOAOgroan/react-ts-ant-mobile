import React from 'react';
import PropTypes from 'prop-types'; 
import { formatIntervalToText } from 'UTIL/base/timeFormat';

import 'ASSET/scss/team/team.scss';

export default class UserinfoBox extends React.Component {
  componentWillMount() {
  }
  componentDidMount() {
  }
  render() {
    let _info = this.props.data;
    return (
        <div className="team__cell">
          <div className="team__cell-top">
            <div className="team__user-profile">
              <i className="team__user-avatar"></i>
              <h3>{_info.name}</h3>
            </div>
            <div className="cell-group border-none team__cell-group margin-none">
                <div className="cell no-padding" onClick={() => this.goOrderList()}>
                  关联订单
                  <i className="iconfont myzd-bd-arrow-right"></i>
                  <span className="team__cell-right team__graylight">{_info.order_num}</span>
                </div>
                <div className="cell no-padding" onClick={() => this.goDoctorList()}>
                  关联医生
                  <i className="iconfont myzd-bd-arrow-right"></i>
                  <span className="team__cell-right team__graylight">{_info.doctor_num}</span>
                </div>
            </div>
          </div>
          <div className="cell-group border-top-none team__cell-group margin-none">
              <div className="cell no-padding" onClick={() => this.goOrderList()}>
                  未激活医师 <span className="team__highlight">{_info.no_active_doctor_num}</span> 位
              </div>
              <div className="cell no-padding" onClick={() => this.goDoctorList()}>
                  新订单<span className="team__graylight">（ {formatIntervalToText(_info.new_order_time)} ）</span>
              </div>
          </div>
        </div>
    );
  }
};

UserinfoBox.propTypes = {
  data: PropTypes.object
};

