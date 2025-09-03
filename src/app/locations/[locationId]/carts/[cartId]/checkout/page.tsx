import React from "react";
import Checkout from "./Checkout";

export async function generateMetadata() {
  return {
    title: "Checkout - Tomodachi Sushi",
  };
}

const page = () => {
  return <Checkout />;
};

export default page;
