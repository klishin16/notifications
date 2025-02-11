import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { NotificationProvider } from "./components/notifications/NotificationsProvider";
import NotificationsContainer from "./components/notifications/NotificationsContainer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <NotificationProvider>
      <NotificationsContainer />

      <App />
    </NotificationProvider>
  </BrowserRouter>
);
