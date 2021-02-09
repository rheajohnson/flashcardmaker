import React from "react";
import { Layout, Menu } from "antd";
import FCSets from "./pages/fc-sets";
import FCList from "./pages/fc-list";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
const { Header, Footer } = Layout;

const App = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <Link to="/">
            <div className="logo" />
          </Link>
          <Menu theme="dark" mode="horizontal">
            <Menu.Item key="1" className="sign-out-button">
              Sign Out
            </Menu.Item>
          </Menu>
        </Header>
        <Switch>
          <Route path="/" exact component={FCSets} />
          <Route path="/set/:name" exact component={FCList} />
        </Switch>
        <Footer className="footer"></Footer>
      </Layout>
    </Router>
  );
};

export default App;
