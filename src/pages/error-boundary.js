import React, { Component } from "react";
import { Layout } from "antd";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout className="content-layout">
          <h1>Something went wrong...</h1>
        </Layout>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
