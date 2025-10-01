import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/authSlice";
import { setClientName } from "./redux/slices/clientSlice";
import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Searchschedule from "./components/searchschedule";
import LoginComponent from "./components/loginComponent";
import LandingPage from "./components/landingPage";

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { clientname } = useSelector((state) => state.client);

  const handleLogin = (username, password) => {
    dispatch(login({ username, password, clientname }));
  };

  // Component to handle dynamic routes
  const DynamicRouteHandler = () => {
    const { apiType } = useParams();
    const dispatch = useDispatch();
    const { sessionData } = useSelector((state) => state.auth);
    const { clientname } = useSelector((state) => state.client);

    useEffect(() => {
      if (
        apiType === "charlotte" ||
        apiType === "untcom" ||
        apiType === "dps"
      ) {
        if (apiType !== clientname) {
          dispatch(setClientName(apiType));
          dispatch(logout()); // Logout only if client name changes
        }
      }
    }, [apiType, clientname, dispatch]);

    // Redirect user based on sessionData
    return sessionData ? (
      <Searchschedule />
    ) : (
      // <Searchschedule />
      <LoginComponent onLogin={handleLogin} loading={loading} error={error} />
    );
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:apiType" element={<DynamicRouteHandler />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
