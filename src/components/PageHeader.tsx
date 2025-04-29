import type { ReactNode } from "react";

export function PageHeader({
  title,
  afterTitleOutlet,
}: {
  title: string;
  afterTitleOutlet?: ReactNode;
}) {
  return (
    <div className="container flex justify-between items-center mt-10 mb-5">
      <h1 className=" text-2xl font-semibold">{title}</h1>
      {afterTitleOutlet}
    </div>
  );
}
