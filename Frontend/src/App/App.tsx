import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";
import PageAnimation from "react-page-animation";

import Home from "./Home";
import Game from "./Game";

function Null() {
  return <div></div>;
}

function App() {
  // hacky stuff to prevent first remount
  const history = useHistory();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    history.push("/random-hack");
    history.goBack();
    setMounted(true);
  }, []);

  return (
    <div>
      <PageAnimation classExtension="pages" grid={[[/\/$/, /^\/[a-z0-9]+/i]]} timeout={300} animate={mounted}>
        <Switch>
          <Route path="/random-hack" component={Null} />
          <Route path="/:id" component={Game} />
          <Route path="/" component={Home} />
        </Switch>
      </PageAnimation>
    </div>
  );
}

export default App;
