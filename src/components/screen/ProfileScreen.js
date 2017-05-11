import React from 'react';

import UserinfoBox from '../common/profile/UserinfoBox';

export default class ProfileScreen extends React.Component {
    componentWillMount() {
    }
    componentDidMount() {
        document.title = '个人中心';
    }
    render() {
        return (
            <div className="profile">
                <UserinfoBox />
            </div>
        );
    }
}
