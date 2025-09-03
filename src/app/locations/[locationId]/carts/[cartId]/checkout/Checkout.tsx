"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutDetails from "./CheckoutDetails";
import CheckoutPayment from "./CheckoutPayment";

const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const pageView = searchParams.get("pageView") ?? "0";
  const isFirstPage = pageView === "0";

  return isFirstPage ? <CheckoutDetails /> : <CheckoutPayment />;
};

const Checkout = () => {
  return (
    <Suspense fallback={<div>Loading checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
};

export default Checkout;