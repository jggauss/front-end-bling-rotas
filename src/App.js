import React from "react";
import { BrowserRouter as Router} from "react-router-dom"
import RoutesAdm from "./routes/routesAdm.js";

function App() {
  return (
    <div>
      <Router>
        <RoutesAdm/>
      </Router>
    </div>
  );
}

export default App;
