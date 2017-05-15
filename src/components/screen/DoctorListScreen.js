import React from 'react';
import DoctorCellBox from '../common/doctor/DoctorCellBox';

import 'ASSET/scss/doctor/doctorListScreen.scss';
const mockData = [{
        no_active_doctor_num: 2,
        new_order_time: '2017/05/12 14:09:00',
        name: '王三宫',
        order_num: 28,
        doctor_num: 12
    }, {
        no_active_doctor_num: 5,
        new_order_time: '2017/05/11 14:09:00',
        name: '戚呱呱',
        order_num: 20,
        doctor_num: 9
    }
];

export default class DoctorListScreen extends React.Component {
    componentWillMount() {
    }
    componentDidMount() {
        document.title = 'xxx的医生';
        // xxx - 个人中心
    }
    render() {
        return (
            <div className="doctor-list-screen">
                <div className="doctor-list-screen__filter">
                </div>
                <div className="doctor-list-screen__list">
                {
                    mockData.map((item, i)=>{
                        return <DoctorCellBox key={i} data={item}/>;
                    })
                }
                </div>
            </div>
        );
    }
}
