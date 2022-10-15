import React from "react";
import { BrowserRouter as Router } from "react-router-dom"
import RoutesAdm from "./routes/routesAdm.js";
import { AuthProvider } from "./Context/AuthContext.js"

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <RoutesAdm />
        </Router>

      </AuthProvider>


    </div>
  );
}

export default App;
