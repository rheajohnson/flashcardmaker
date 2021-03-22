import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Sets from "./pages/sets";
import Flashcards from "./pages/flashcards";
import Login from "./pages/login";
import Register from "./pages/register";
import Study from "./pages/study";
import Account from "./pages/account";
import MainHeader from "./components/main-header";

import { useDispatch } from "react-redux";
import { getUser } from "./redux/actions/auth";

const App = () => {
  const dispatch = useDispatch();
  useEffect(async () => {
    dispatch(getUser());
  }, []);

  return (
    <Router>
      <MainHeader />
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/account" exact component={Account} />
        <Route path="/:id" exact component={Flashcards} />
        <Route path="/:id/study" exact component={Study} />
        <Route path="/" component={Sets} />
      </Switch>
    </Router>
  );
};

export default App;
