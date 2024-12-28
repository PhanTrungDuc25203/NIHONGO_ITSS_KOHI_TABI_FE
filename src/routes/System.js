import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect, Route, Switch } from 'react-router-dom';
import UserManage from '../containers/System/UserManage';
import AdminPageSidebar from '../components/AdminPageSidebar/AdminPageSidebar';
import ProductManage from '../containers/System/ProductManage';
import RegisterPackageGroupOrAcc from '../containers/System/RegisterPackageGroupOrAcc';
import Settings from '../containers/Admin/Settings/Settings';
import CoffeeShopManage from '../containers/Admin/CoffeeShopManage/CoffeeShopManage';
import Dashboard from '../containers/Admin/Dashboard/Dashboard';
import UsersManagement from '../containers/Admin/UsersManagement/UsersManagement';
import TestPage from '../containers/Admin/TestPage/TestPage';

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                <AdminPageSidebar />
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route path="/system/user-manage" component={UserManage} />
                            <Route path="/system/product-manage" component={ProductManage} />
                            <Route path="/system/register-package-group-or-account" component={RegisterPackageGroupOrAcc} />

                            <Route path="/system/settings" component={Settings} />
                            <Route path="/system/coffee-shop-manage" component={CoffeeShopManage} />
                            <Route path="/system/dashboard" component={Dashboard} />
                            <Route path="/system/users-management" component={UsersManagement} />
                            <Route component={() => { return (<Redirect to={systemMenuPath} />) }} />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        systemMenuPath: state.app.systemMenuPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
