import React from "react";
import { Switch, Route } from "react-router-dom";
import PageAnimation from "react-page-animation";

import Home from "./Home";
import Game from "./Game";

function App() {
  return (
    <div>
      <PageAnimation classExtension="pages" grid={[[/\/$/, /\/create$/, /^\/[a-z0-9]+/i]]} timeout={300} animate={false}>
        <Switch>
          <Route path="/:id" component={Game} />
          <Route path="/" component={Home} />
        </Switch>
      </PageAnimation>
    </div>
  );
}

export default App;
