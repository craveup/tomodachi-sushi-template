"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import CheckoutDetails from "./CheckoutDetails";
import CheckoutPayment from "./CheckoutPayment";

const Checkout = () => {
  const searchParams = useSearchParams();
  const pageView = searchParams.get("pageView") ?? "0";
  const isFirstPage = pageView === "0";

  return isFirstPage ? <CheckoutDetails /> : <CheckoutPayment />;
};

export default Checkout;