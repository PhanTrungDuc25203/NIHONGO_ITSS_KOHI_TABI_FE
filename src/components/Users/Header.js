import { Component } from "react";
import {connect} from 'react-redux';
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

    componentDidUpdate(prevProps) {}

    changeLanguage(language) {
        this.props.switchLanguageOfWebsite(language);
    }

    render() {
        console.log("check props: ", this.props);
        return (
            <div className="header">
                <div className="logo">
                    <span className="logoKohi">KOHI</span>
                    <span className="logoTabi">TABI</span>
                </div>
                <div className="userInfo">
                    <div className="userAvatar">
                        <img src={avatar} alt="avatar" />
                    </div>
                    <div className="userText">
                        <span className="userName"><FormattedMessage id="header.user-logo.name"/></span>
                        <span className="userEmail">dothuyduong25022003@gmail.com</span>
                    </div>
                    <button
                        onClick={()=>{this.changeLanguage(languages.EN)}}
                        hidden
                    >Change language</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        switchLanguageOfWebsite: (language) => dispatch(actions.switchLanguageOfWebsite(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersHeader);