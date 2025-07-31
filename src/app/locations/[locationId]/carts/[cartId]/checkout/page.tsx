import React from "react";
import Checkout from "./Checkout";

export async function generateMetadata() {
  return {
    title: "Checkout - Leclerc Bakery",
  };
}

const page = () => {
  return <Checkout />;
};

export default page;