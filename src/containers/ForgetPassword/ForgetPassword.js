import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, useNavigate, useHistory } from "react-router-dom";
import { KeyCodeUtils, LanguageUtils, languages } from "../../utils";
import "./Test.scss";
import "./../../components/Card/Card";
import { FormattedMessage } from "react-intl";
import Header from "../../components/Users/Header";

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {} = this.state;

    return (
      <div className="forget-password">
        <Header></Header>
        <div className="forget-password-hihi">
        <div className="forget-password-container">
          <div className="logo">
            <span className="logo-text-1">KOHI</span>
            <span className="logo-text-2">TABI</span>
          </div>
          <h2 className="forget-password-title">
            <FormattedMessage id="forget-password.forget-password-text" />
          </h2>
          <div className="forget-password-form">
            <div className="input-group">
              <label htmlFor="username" className="input-label">
                <FormattedMessage id="login.email" />
              </label>
              <FormattedMessage id="login.email-placeholder">
                {(placeholderText) => (
                  <input
                    type="text"
                    value={this.state.username}
                    id="username"
                    onChange={(event) => {
                      this.handleOnChangeUsername(event);
                    }}
                    name="username"
                    placeholder={placeholderText}
                    className="input-field"
                  />
                )}
              </FormattedMessage>
            </div>
            <button
              className="forget-password-button"
              onClick={() => {
                this.handleTestButtonClicked();
              }}
            >
              <FormattedMessage id="forget-password.forget-password-text" />
            </button>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Test)
);
