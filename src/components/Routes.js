import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

/*================== Rutas ==================*/

//Varios
import Survey from "./Survey";
import NotFound from "./NotFound";

export default class Routes extends Component {
  render() {
    return (
      <Router>
        {
          <Switch>
            <Route exact path="/:token" component={Survey} />
            <Route component={NotFound} />
          </Switch>
        }
      </Router>
    );
  }
}
