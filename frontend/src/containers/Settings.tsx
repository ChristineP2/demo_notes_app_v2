import React, { useState } from "react";
import { API } from "aws-amplify";
import { Elements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {BillingDetailsType} from "../lib/billingLib";
import { onError } from "../lib/errorLib";
import BillingForm from "./BillingForm";
import "./Settings.css";
import config from "../config";

export default function Settings() {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const stripePromise = loadStripe(config.STRIPE_KEY);

  function billUser(details: BillingDetailsType) {
    return API.post("notes", "/billing", {
      body: details,
    });
  }

  async function handleFormSubmit(storage: string, { token, error }: { token: any, error: any }):Promise<void> {
    if (error) {
      onError(error);
      return;
    }

    setIsLoading(true);

    try {
      await billUser({
        storage,
        source: token.id,
      });

      alert("Your card has been charged successfully!");
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  return (
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        options={{ fonts: [{
            cssSrc:
              "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
          }] }}
      >
        <BillingForm isLoading={isLoading} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );

}
