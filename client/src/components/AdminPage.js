import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { NavLink, Switch, Route } from "react-router-dom";
import Loadable from "react-loadable";
import Spinner from "../utils/Spinner";

const Overview = Loadable({
  loader: () => import("./Overview"),
  loading() {
    return <Spinner />;
  },
});

const Details = Loadable({
  loader: () => import("./Details"),
  loading() {
    return <Spinner />;
  },
});

const AdminPage = () => {
  const { logout } = useContext(GlobalContext);
  return (
    <div>
      <ul>
        <li>
          <NavLink to="/admin/overview">Overview</NavLink>
        </li>
        <li>
          <NavLink to="/admin/details">User details</NavLink>
        </li>
      </ul>
      <button onClick={logout}>Logout admin</button>
      <Switch>
        <Route path="/admin" exact>
          <h1>Welcome Admin</h1>
        </Route>
        <Route path="/admin/overview" component={Overview} />
        <Route path="/admin/details" component={Details} />
      </Switch>
    </div>
  );
};

export default AdminPage;
