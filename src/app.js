import React, { useEffect } from "react";
import { Route, Switch, HashRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sets from "./pages/sets";
import FlashcardList from "./pages/flashcard-list";
import Login from "./pages/login";
import Register from "./pages/register";
import Study from "./pages/study";
import Account from "./pages/account";
import MainHeader from "./components/main-header";
import { getUser } from "./redux/actions/auth";

const App = () => {
  const dispatch = useDispatch();
  useEffect(async () => {
    dispatch(getUser());
  }, []);

  return (
    <HashRouter>
      <MainHeader />
      <Switch>
        <Route path="/" exact component={Sets} />
        <Route path="/set/:id" exact component={FlashcardList} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/set/:id/study" exact component={Study} />
        <Route path="/account" exact component={Account} />
      </Switch>
    </HashRouter>
  );
};

export default App;
