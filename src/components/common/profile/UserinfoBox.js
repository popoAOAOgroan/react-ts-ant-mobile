import React from 'react';

export default class UserinfoBox extends React.Component {
  componentWillMount() {
  }
  componentDidMount() {
  }
  render() {
    return (
        <div className="">
          <div>
            <div><i></i></div>
            <div>
              <h3>王俊雅</h3>
              <p>
                <span>共 522 医生</span>
                <span>8522个订单</span>
              </p>
            </div>
          </div>
          <div className="cell-group border-top-none usercenter_body--border-bottom">
              <div className="cell height-auto no-padding" onClick={() => this.goInviter()}>
                  <i className="iconfont myzd-doctor-huizhenguwen"></i>
                  我的订单
                  <i className="iconfont myzd-doctor-arrow-right"></i>
              </div>
              <div className="cell height-auto no-padding" onClick={() => this.goAgreement()}>
                  <i className="iconfont myzd-doctor-xieyi"></i>
                  我的医生
                  <i className="iconfont myzd-doctor-arrow-right"></i>
              </div>
          </div>
        </div>
    );
  }
}
