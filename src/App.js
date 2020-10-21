import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Container } from "semantic-ui-react";
import "./App.scss";
import { Login } from "./components/Auth";
import { ModelDetailsPage, ModelForm, Models } from "./components/Models";
import {
  SessionDetailsPage,
  SessionForm,
  Sessions,
} from "./components/Sessions";
import { Home, Navbar, PageLoader } from "./components/Ui";
import { auth } from "./firebase";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Router>
        {!loading && !user && <Redirect to="/login" />}
        <Navbar user={user} />
        {loading ? (
          <PageLoader />
        ) : (
          <Container style={{ marginTop: 25 }}>
            <Switch>
              <Route path="/login" component={!user ? Login : Home} />
              <Route exact path="/sessions" component={Sessions} />
              <Route exact path="/models" component={Models} />
              <Route path="/createSession" component={SessionForm} />
              <Route path="/createModel" component={ModelForm} />
              <Route path="/sessions/:id/edit" component={SessionForm} />
              <Route path="/models/:id/edit" component={ModelForm} />
              <Route
                exact
                path="/sessions/:id"
                component={SessionDetailsPage}
              />
              <Route
                exact
                path="/sessions/:id/:tab"
                component={SessionDetailsPage}
              />
              <Route path="/models/:id" component={ModelDetailsPage} />
              <Route exact path="/" component={Home} />
            </Switch>
          </Container>
        )}
        {/* <Footer /> */}
      </Router>
    </div>
  );
};

export default App;
