import React from "react";
import { Switch, Route } from "react-router-dom";
import PageAnimation from "react-page-animation";

import Home from "./Home";
import Board from "./Board";

function App() {
  return (
    <div>
      <PageAnimation classExtension="pages" grid={[[/\/$/, /^\/[a-z0-9]+/i]]} timeout={300}>
        <Switch>
          <Route path="/:id" component={Board} />
          <Route path="/" component={Home} />
        </Switch>
      </PageAnimation>
    </div>
  );
}

export default App;
