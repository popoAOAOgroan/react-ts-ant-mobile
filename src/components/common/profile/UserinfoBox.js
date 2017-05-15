import React from 'react';
import PropTypes from 'prop-types'; 

import 'ASSET/scss/profile/profile.scss';

export default class UserinfoBox extends React.Component {
  componentWillMount() {
  }
  componentDidMount() {
  }
  goOrderList() {

  }
  goDoctorList() {

  }
  render() {
    let _type = this.props.type;
    let _data = this.props.data;
    return (
        <div className="">
          <div className="profile__box--bg bottom-border">
            <div className="profile__user-avatar"></div>
            <div className="profile__user-info">
              <h3>{_data.name}</h3>
              <p>
                <span>共 {_data.doctor_num} 医生</span>
                <span>{_data.order_num} 个订单</span>
              </p>
            </div>
          </div>
          <div className="cell-group border-top-none profile__cell-group">
              <div className="cell no-padding" onClick={() => this.goOrderList()}>
                  <i className="iconfont myzd-bd-wodedingdan"></i>
                  {_type == 'mine' && '我的订单'}
                  {_type == 'other' && 'TA的订单'}
                  <i className="iconfont myzd-bd-arrow-right"></i>
              </div>
              <div className="cell no-padding" onClick={() => this.goDoctorList()}>
                  <i className="iconfont myzd-bd-wodeyisheng"></i>
                  {_type == 'mine' && '我的医生'}
                  {_type == 'other' && 'TA的医生'}
                  <i className="iconfont myzd-bd-arrow-right"></i>
              </div>
          </div>
        </div>
    );
  }
};

UserinfoBox.propTypes = {
  data: PropTypes.object,
  key: PropTypes.number // mine or other
};

