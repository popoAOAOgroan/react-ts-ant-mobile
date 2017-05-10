import React, { Component } from 'react';

export default class NotFound extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentWillMount() {
    // alert('404 NOT FOUND')
    console.log('404');
    this.context.router.replace('/');
  }

  render () {
    // 非实体组件需显式返回 null
    return null;
  }
}
