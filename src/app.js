import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import FCSets from "./pages/fc-sets";
import FCList from "./pages/fc-list";
import Login from "./pages/login";
import Register from "./pages/register";
import MainHeader from "./components/main-header";
import AuthService from "./services/auth-service";
import { setUser } from "./redux/actions/auth";

const App = () => {
  const dispatch = useDispatch();
  useEffect(async () => {
    const activeSession = await AuthService.getSession();
    if (activeSession) dispatch(setUser(activeSession.username));
  }, []);
  return (
    <Router>
      <MainHeader />
      <Switch>
        <Route path="/" exact component={FCSets} />
        <Route path="/set/:id" exact component={FCList} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Router>
  );
};

export default App;
