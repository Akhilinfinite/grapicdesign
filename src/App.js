import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "./redux/slices/authSlice";
import { setClientName } from "./redux/slices/clientSlice";

import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";

// Layout
import AppLayout from "./components/AppLayout";

// Pages
import SearchSchedule from "./components/rightDashboard";
import LoginComponent from "./components/loginComponent";
import LandingPage from "./components/landingPage";
import ScheduleConfirmation from "./components/scheduleConfirmation";
import ScheduleResult from "./components/searchResult";
import ScheduleRequest from "./components/scheduleRequest";
import ScrollToTop from "./ScrollToTop";

const allowed = ["dps", "untcom", "charlotte"];

function App() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const globalClientName = useSelector((s) => s.client.clientname);

  const handleLogin = (username, password) => {
    dispatch(login({ username, password, clientname: globalClientName }));
  };

  const TenantWrapper = () => {
    const { apiType } = useParams();
    const dispatch = useDispatch();

    const sessionData = useSelector((state) => state.auth.sessionData);
    const clientname = useSelector((state) => state.client.clientname);

    useEffect(() => {
      if (!allowed.includes(apiType)) return;

      if (apiType !== clientname) {
        dispatch(setClientName(apiType));
        dispatch(logout());
      }
    }, [apiType, clientname, dispatch]);

    return (
      <Routes>
        <Route
          path="login"
          element={
            sessionData ? (
              <Navigate to={`/${apiType}/searchSchedule`} replace />
            ) : (
              <LoginComponent
                onLogin={handleLogin}
                loading={loading}
                error={error}
              />
            )
          }
        />

        <Route
          path="searchSchedule"
          element={
            sessionData ? (
              <AppLayout>
                <SearchSchedule />
              </AppLayout>
            ) : (
              <Navigate to={`/${apiType}/login`} replace />
            )
          }
        />

        <Route
          path="ScheduleConfirmation"
          element={
            sessionData ? (
              <AppLayout>
                <ScheduleConfirmation />
              </AppLayout>
            ) : (
              <Navigate to={`/${apiType}/login`} replace />
            )
          }
        />

        <Route
          path="ScheduleResult"
          element={
            sessionData ? (
              <AppLayout>
                <ScheduleResult />
              </AppLayout>
            ) : (
              <Navigate to={`/${apiType}/login`} replace />
            )
          }
        />
        <Route
          path="ScheduleEdit"
          element={
            sessionData ? (
              <AppLayout>
                <ScheduleRequest />
              </AppLayout>
            ) : (
              <Navigate to={`/${apiType}/login`} replace />
            )
          }
        />

        {/* fallback */}
        <Route
          path="*"
          element={<Navigate to={`/${apiType}/login`} replace />}
        />
      </Routes>
    );
  };

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/:apiType/*" element={<TenantWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
