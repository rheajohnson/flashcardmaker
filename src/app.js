import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";
import Sets from "./pages/sets";
import FlashcardList from "./pages/flashcard-list";
import Login from "./pages/login";
import Register from "./pages/register";
import Study from "./pages/study";
import Account from "./pages/account";
import MainHeader from "./components/main-header";
import AuthService from "./services/auth-service";
import { setUser } from "./redux/actions/auth";

const App = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    try {
      const activeSession = await AuthService.getSession();
      if (activeSession) {
        dispatch(
          setUser({ username: activeSession.payload.username }, true, true)
        );
      }
    } catch (e) {
      console.log("No active user");
    }
  }, []);

  return (
    <Router>
      <MainHeader />
      <Switch>
        <Route path="/" exact component={Sets} />
        <Route path="/set/:id" exact component={FlashcardList} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
        <Route path="/set/:id/study" exact component={Study} />
        <Route path="/account" exact component={Account} />
      </Switch>
    </Router>
  );
};

export default App;
