import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import { IssuesTrendChart, DepartmentPerformance, RecentIssues } from "@/components/civic/CivicComponents";

export const metadata: Metadata = {
  title:
    "CivicResolve Admin Portal",
  description: "Overview of civic issue management",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <EcommerceMetrics />
      </div>

      <div className="col-span-12 xl:col-span-8">
        <IssuesTrendChart />
      </div>

      <div className="col-span-12 xl:col-span-4">
        <DepartmentPerformance />
      </div>

      <div className="col-span-12">
        <RecentIssues />
      </div>
    </div>
  );
}
