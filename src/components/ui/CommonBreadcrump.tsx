"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CommonBreadcrumbProps {
  title: string;
  href: string;
}

const CommonBreadcrumb = ({ title, href }: CommonBreadcrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-base font-satoshi-500">
        <BreadcrumbItem>
          <Link 
            href="/admin-dashboard"
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Dashboard
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* <BreadcrumbItem>
          <Link href={href}>{title}</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator /> */}
        <BreadcrumbItem>
          <BreadcrumbPage className="text-gray-900">{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default CommonBreadcrumb;