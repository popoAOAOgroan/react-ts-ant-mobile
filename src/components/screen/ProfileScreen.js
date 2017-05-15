import React from 'react';

import UserinfoBox from '../common/profile/UserinfoBox';

const mockData = {
    doctor_num: 12,
    order_num: 23,
    name: '石小碗'
};

export default class ProfileScreen extends React.Component {
    componentWillMount() {
    }
    componentDidMount() {
        document.title = '个人中心';
        // xxx - 个人中心
    }
    render() {
        return (
            <div className="profile">
                <UserinfoBox data={mockData} type="other"/>
            </div>
        );
    }
}
