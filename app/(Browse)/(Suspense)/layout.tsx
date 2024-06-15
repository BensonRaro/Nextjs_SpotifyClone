import Loader from "@/components/Loader";
import { Suspense } from "react";

const SuspenseLayout = ({ children }: { children: React.ReactNode }) => {
  return <Suspense fallback={<Loader />}>{children}</Suspense>;
};

export default SuspenseLayout;
