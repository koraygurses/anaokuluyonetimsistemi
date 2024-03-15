import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import axios, { AxiosResponse } from "axios";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container!);

//set token when available
//delete token when unavailable
//dont really intercept when desired (with path)

var getLocation = function (href: any) {
  var l = document.createElement("a");
  l.href = href;
  return l;
};

// if any request must be made excluding the token, here is a interceptor for it
axios.interceptors.request.use(
  (config) => {
    const excludePaths = ["/auth/login", "/other-excluded-path"];

    if (config.url && excludePaths.includes(getLocation(config.url).pathname)) {
      return config;
    }

    const token = localStorage.getItem("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // rol eğer token yoksa olsa sıkıntı olur mu? bu silme çalışmıyor
      // const dispatch = useAppDispatch();
      // dispatch(setRole(""));

      // Handle the case where the token is missing or has been deleted
      console.log("Token is missing or deleted. Aborting request.");
      return Promise.reject("Token is missing or deleted.");
    }
    return config;
  },
  (error) => {
    console.log("Something something token");
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // If the response status is 401 Unauthorized, handle it here
    if (error.response && error.response.status === 401) {
      // Your code to handle 401 Unauthorized errors
      // For example, you can redirect the user to a login page
      console.error("Unauthorized request. Redirecting to login page.");
      // Your code to handle redirection
      // sadece auth ve user sileriz ileride
      localStorage.clear();
      // window.location.href = "/login";
    }

    // Return any other errors to be handled elsewhere
    return Promise.reject(error);
  }
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
