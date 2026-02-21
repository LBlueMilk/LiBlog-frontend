import { Suspense } from "react";
import LoginPage from "@/app/pages/LoginPage";

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <LoginPage />
    </Suspense>
  );
}