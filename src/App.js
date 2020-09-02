import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./routes";

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Routes />
        </Router>
      </div>
    );
  }
}

export default App;
