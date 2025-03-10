import { Component } from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'; // Import withRouter
import './Header.scss';
import avatar from '../../assets/header/avatar.jpg';
import { LanguageUtils, languages } from "../../utils";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions";

class UsersHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            email: '',
        };
    }

    componentDidMount() {

    }

    componentDidUpdate(prevProps) { }

    changeLanguage(language) {
        this.props.switchLanguageOfWebsite(language);
    }

    handleLogoClick = () => {
        this.props.history.push('/homepage'); // Chuyển hướng đến /homepage
    }

    navigateToProfilePage = () => {
        this.props.history.push(`/user-profile/${this.props.userInfo.email}`);
    }

    handleUserInfoClick = () => {
        if (this.props.isLoggedIn) {
            this.navigateToProfilePage();
        } else {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <div className="header">
                <div className="logo" onClick={this.handleLogoClick}>
                    <span className="logoKohi">KOHI</span>
                    <span className="logoTabi">TABI</span>
                </div>
                <div className="userInfo" onClick={this.handleUserInfoClick}>
                    <div className="userAvatar">
                        <img src={avatar} alt="avatar" />
                    </div>

                    <div className="userText">
                        <span className="userName">{this.props.isLoggedIn ?
                            this.props.userInfo && this.props.userInfo.name && this.props.userInfo.name
                            :
                            'Đăng nhập'
                        }</span>
                        <span className="userEmail">
                            {this.props.isLoggedIn ?
                                this.props.userInfo && this.props.userInfo.email && this.props.userInfo.email
                                :
                                ''
                            }
                        </span>
                        <div className="languageButtons">
                            <button
                                onClick={() => { this.changeLanguage(languages.JA) }}
                            >日本語</button>
                            <button
                                onClick={() => { this.changeLanguage(languages.EN) }}
                            >English</button>
                            <button
                                onClick={() => { this.navigateToProfilePage() }}
                            >Profile</button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UsersHeader));