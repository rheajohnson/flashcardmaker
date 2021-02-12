import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FCSets from "./pages/fc-sets";
import FCList from "./pages/fc-list";
import Login from "./pages/login";
import Register from "./pages/register";
import MainHeader from "./components/main-header";

const App = () => {
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
