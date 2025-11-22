"use client";
import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/shared/components/ui/breadcrumb";

interface BreadcrumbItem {
  id: string;
  name: string;
}

interface FolderBreadcrumbsProps {
  folderPath: BreadcrumbItem[];
}

export function FolderBreadcrumbs({ folderPath }: FolderBreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-lg">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard" prefetch>My Drive</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {folderPath.map((folder, index) => {
          const isLast = index === folderPath.length - 1;
          return (
            <Fragment key={folder.id}>
              <BreadcrumbSeparator key={`separator-${folder.id}`} />
              <BreadcrumbItem key={folder.id}>
                {isLast ? (
                  <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={`/dashboard/${folder.id}`} prefetch>{folder.name}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
