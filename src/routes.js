import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Components/Home";

class Routes extends Component {
  constructor(props) {
    super(props);
    this.Routes = [
      {
        path: "/",
        exact: true,
        component: Home,
        title: "home"
      }
    ];
  }

  renderComponents = (props, RouteComponent, title) => {
    return <RouteComponent {...props} />;
  };

  render() {
    return (
      <div>
        <main>
          <Switch>
            {this.Routes.map((route, i) => (
              <Route
                key={i}
                exact={route.exact}
                path={route.path}
                render={props =>
                  this.renderComponents(props, route.component, route.title)
                }
              />
            ))}
          </Switch>
        </main>
      </div>
    );
  }
}

export default Routes;
