import React, {Component} from 'react';

export default class Profile extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    }
    componentDidMount() {
        document.title = '用户中心';
    }
    render() {
        return (
            <div className="profile">
                用户中心
            </div>
        );
    }
}
