import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/authSlice";
import { setClientName } from "./redux/slices/clientSlice";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import Searchschedule from "./components/searchschedule";
import LoginComponent from "./components/loginComponent";
import LandingPage from "./components/landingPage";

function App() {
  const dispatch = useDispatch();
  const { sessionData, loading, error } = useSelector((state) => state.auth);
  const { clientname } = useSelector((state) => state.client);

  const handleLogin = (username, password) => {
    dispatch(login({ username, password, clientname }));
  };

  // Component to handle dynamic routes
  const DynamicRouteHandler = () => {
    const { apiType } = useParams();

    useEffect(() => {
      if (apiType === "charlotte" || apiType === "untcom"|| apiType === "dps") {
        if (apiType !== clientname) {
          dispatch(setClientName(apiType));
          dispatch(logout()); // Logout if the clientname changes
        }
        dispatch(setClientName(apiType)); // Update clientname
      } else {
        dispatch(setClientName(null)); // Reset if invalid
      }
    }, [apiType, clientname, dispatch]);

    // Render based on session data and apiType
    if (apiType === "charlotte" || apiType === "untcom"|| apiType === "dps") {
      return sessionData ? (
        <Searchschedule />
      ) : (
        <LoginComponent onLogin={handleLogin} loading={loading} error={error} />
      );
    }

    return <Navigate to="/" />;
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/graphicDesign/" element={<LandingPage />} />

          {/* Dynamic Route */}
          <Route
            path="/graphicDesign/:apiType"
            element={<DynamicRouteHandler />}
          />

          {/* Redirect unknown routes to landing page */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
