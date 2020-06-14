import React from "react";
import { NavLink, Route, Switch, withRouter } from "react-router-dom";
import { GlobalProvider } from "./context/GlobalContext";
import PrivateRoute from "./utils/PrivateRoute";
import Form from "./components/Form"
import EmailSender from "./components/EmailSender"
import Login from "./components/Login"
import AdminPage from "./components/AdminPage"

function App() {
  return (
    <GlobalProvider>
      <ul>
        <li>
          <NavLink to="/">Home Page</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login Page</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin Page</NavLink>
        </li>
      </ul>
      <Switch>
        <Route path="/" component={EmailSender} exact />
        <Route path="/form/:token" component={Form} />
        <Route path="/login" component={Login} exact />
        {/* Private Route */}
        <PrivateRoute path="/admin" component={AdminPage} />
        {/* <Spinner /> */}
      </Switch>
    </GlobalProvider>
  );
}

export default withRouter(App);
