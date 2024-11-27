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

        };
    }

    componentDidMount() {
        
    }

    handleLogoClick = () => {
        this.props.history.push('/homepage'); // Chuyển hướng đến /homepage
    }

    render() {
        return (
            <div className="header">
                <div className="logo" onClick={this.handleLogoClick}>
                    <span className="logoKohi">KOHI</span>
                    <span className="logoTabi">TABI</span>
                </div>
                <div className="userInfo">
                    <div className="userAvatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className="userText">
                        <span className="userName">Đỗ Thùy Dương</span>
                        <span className="userEmail">magi@example.com</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(connect(null, actions)(UsersHeader));