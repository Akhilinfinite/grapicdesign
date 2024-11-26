// src/App.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "./redux/slices/authSlice";
import Searchschedule from "./components/searchschedule";
import LoginComponent from "./components/loginComponent";

function App() {
  const dispatch = useDispatch();
  const { sessionData, loading, error } = useSelector((state) => state.auth);

  const handleLogin = (username, password) => {
    dispatch(login({ username, password }));
  };



  return (
    <div className="App">
      {(sessionData) ? (
        <div>
          <Searchschedule />
        </div>
      ) : (
        <LoginComponent onLogin={handleLogin} loading={loading} error={error} />
      )}
    </div>
  );
}

export default App;
