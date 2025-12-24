"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CountryManagement from "./CountryManagement";
import MainListHeading from "@/components/ui/MainListHeading";
import CommonBreadcrump from "@/components/ui/CommonBreadcrump";
import RegionManagement from "./RegionManagement";
// import RegionManagement from "./RegionManagement"; 

const RegionAndCountryManagement = () => {
  const [activeTab, setActiveTab] = useState("regions");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start gap-2 md:flex-row md:items-center justify-between px-4">
        <MainListHeading title="Region Management" />
        <CommonBreadcrump title="Region Management" href="/regions" />
      </div>

      {/* Tabs Container */}
      <div className="p-6 bg-white rounded-lg">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Tab List */}
          <TabsList className="grid w-full grid-cols-2 mb-6 min-h-[45px] font-satoshi-500 text-lg!">
            <TabsTrigger value="regions" className="font-satoshi-500! text-lg!">Region Management</TabsTrigger>
            <TabsTrigger value="countries" className="font-satoshi-500! text-lg!">Country Management</TabsTrigger>
          </TabsList>

          {/* Region Management Tab */}
          <TabsContent value="regions" className="mt-0">
            <RegionManagement />
          </TabsContent>

          {/* Country Management Tab */}
          <TabsContent value="countries" className="mt-0">
            <CountryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegionAndCountryManagement;