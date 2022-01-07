import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Loading from "./Utilities/Loading";
import ApplicationError from "./Utilities/ApplicationError";
import ServerError from "./Utilities/ServerError";
import ManageGroups from "./ManageGroups";
import ManageAreas from "./ManageAreas";
import ManageDevices from "./ManageDevices";

import ManageUsers from "./ManageUsers";
import ManageMap from "./ManageMap";

import ManageOperations from "./ManageOperations";

//layout
import Login from "./Auth/Login";

import { ProtectedRoute } from "./protected.routes";
import { PublicRoute } from "./public.routes";

//------ Rzute Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
  let routes = (
    <Switch>
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/map/login" component={Login} />
      <PublicRoute path="/admin/login" component={Login} />

      <ProtectedRoute exact path="/map" component={ManageMap} />

      <Route exact path="/">
        <Redirect to="map" />
      </Route>
      {/* <Route path="/map" component={ManageMap} /> */}
      <ProtectedRoute path="/admin/groups" component={ManageGroups} />
      <ProtectedRoute path="/admin/areas" component={ManageAreas} />
      <ProtectedRoute path="/admin/devices" component={ManageDevices} />
      <ProtectedRoute path="/admin/operations" component={ManageOperations} />
      <ProtectedRoute exact path="/admin/users" component={ManageUsers} />

      <Route path="*" component={() => "404 NOT FOUND"} />
    </Switch>
  );
  return (
    <Fragment>
      <Loading></Loading>
      {/* UI - show applecation error page  */}
      <ApplicationError></ApplicationError>
      {/* UI - show server error page  */}
      <ServerError></ServerError>
      {routes}
    </Fragment>
  );
};
