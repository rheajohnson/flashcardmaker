import React from "react";
import FCSets from "./pages/fc-sets";
import FCList from "./pages/fc-list";
import MainHeader from "./components/main-header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <MainHeader />
      <Switch>
        <Route path="/" exact component={FCSets} />
        <Route path="/set/:name" exact component={FCList} />
        <Route path="/study/:id" exact component={FCList} />
      </Switch>
    </Router>
  );
};

export default App;
