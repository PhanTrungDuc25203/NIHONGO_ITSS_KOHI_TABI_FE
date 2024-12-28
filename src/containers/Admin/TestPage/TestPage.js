import React, { Component } from 'react';
import './TestPage.scss';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from "../../../store/actions";
import { LanguageUtils, languages } from "../../../utils";
import { FormattedMessage } from "react-intl";
import { adminChangePasswordService } from "../../../services/userService";
import { toast } from 'react-toastify';

class TestPage extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <div className="TestPage-container">
                Test page
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
        processLogout: () => dispatch(actions.processLogout()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TestPage));
