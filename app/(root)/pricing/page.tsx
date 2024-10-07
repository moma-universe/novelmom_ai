import Breadcrumb from "@/components/Common/Breadcrumb";
import Pricing from "@/components/Pricing";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Pricing Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is pricing page description",
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb pageName="멤버쉽" />
      <Pricing />
    </>
  );
};

export default PricingPage;
