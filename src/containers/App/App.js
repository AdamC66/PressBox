import React from "react";
import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "containers/Home";
import TeamPage from "containers/TeamPage";

import { QueryClient, QueryClientProvider } from "react-query";
import Header from "components/Header";
import { AuthProvider } from "context/AuthContext";
import { ReactQueryDevtools } from "react-query/devtools";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Header />
          <Switch>
            <Route exact path="/teams/:teamCode/">
              <TeamPage />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

function About() {
  return <h2>About</h2>;
}

export default App;
