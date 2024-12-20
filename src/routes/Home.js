import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirectTo: null,
        };
    }

    componentDidMount() {
        this.redirectUser();
    }

    componentDidUpdate(prevProps) {
        // Kiểm tra nếu props liên quan đến trạng thái đăng nhập hoặc thông tin người dùng thay đổi
        if (prevProps.isLoggedIn !== this.props.isLoggedIn || prevProps.userInfo !== this.props.userInfo) {
            this.redirectUser();
        }
        if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            this.redirectUser();
        }
    }

    redirectUser = () => {
        const { isLoggedIn, userInfo } = this.props;
        if (isLoggedIn) {
            // Kiểm tra vai trò người dùng và thiết lập liên kết điều hướng
            const linkToRedirect = userInfo.role === '1' ? '/homepage' : '/system';
            this.setState({ redirectTo: linkToRedirect });
        } else {
            this.setState({ redirectTo: '/homepage' });
        }
    };

    render() {
        const { redirectTo } = this.state;
        if (redirectTo) {
            return <Redirect to={redirectTo} />;
        }

        return null;
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
