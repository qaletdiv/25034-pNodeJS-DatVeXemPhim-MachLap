import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51Sc4ec2Nl58bgdXcIpY26KaddnUa6pScV6TR6NjIHjsa4S4TBZnMFHtPKma8OISUcF0cT5DR8SDuktUKdEWDaosg00Qq6WZ132"
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
);
