import { ConnectedRouter as Router } from 'connected-react-router';
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { history } from '../redux';


import { userIsAuthenticated, userIsNotAuthenticated } from '../hoc/authentication';

import { path } from '../utils';

import Home from '../routes/Home';
// import Login from '../routes/Login';
import System from '../routes/System';
import Header from './Header/Header';
import Login from './LoginAuth/Login';
import UsersHeader from '../components/Users/Header';
import UserPreference from './UserPreference/UserPreference';
import Signup from './Signup/Signup';
import Homepage from './Homepage/Homepage';
import Test from './Test/Test';
import LandingPage from '../containers/LandingPage/LandingPage';
import CafeDetail from '../containers/CoffeeShop/DetailCoffeeShop';
import Profile from '../containers/Profile/Profile';
import FindMap from '../containers/FindMap/FindMap'

import ConfirmModal from '../components/ConfirmModal';
import { CustomToastCloseButton } from '../components/CustomToast';

class App extends Component {

    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }

    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <div className="main-container">
                        <ConfirmModal />
                        {this.props.isLoggedIn && <Header />}

                        <span className="content-container">
                            <Switch>
                                <Route path={path.HOME} exact component={(Home)} />
                                <Route path={path.LOGIN} component={userIsNotAuthenticated(Login)} />
                                <Route path={path.SYSTEM} component={userIsAuthenticated(System)} />
                                <Route path={path.HEADER} component={UsersHeader} />
                                <Route path={path.USER_PREFERENCE} component={UserPreference} />
                                <Route path={path.HOMEPAGE} component={Homepage} />
                                <Route path={path.TEST} component={Test} />
                                <Route path={path.LANDING_PAGE} component={LandingPage} />
                                <Route path={path.SIGNUP} component={Signup} />
                                <Route path={path.USER_PROFILE} component={Profile} />
                                <Route path={path.CAFE_DETAIL} component={CafeDetail} />
                                <Route path={path.FIND_MAP} component={FindMap} />
                            </Switch>
                        </span>

                        <ToastContainer
                            className="toast-container" toastClassName="toast-item" bodyClassName="toast-item-body"
                            autoClose={false} hideProgressBar={true} pauseOnHover={false}
                            pauseOnFocusLoss={true} closeOnClick={false} draggable={false}
                            closeButton={<CustomToastCloseButton />}
                        />
                    </div>
                </Router>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        started: state.app.started,
        isLoggedIn: state.admin.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);