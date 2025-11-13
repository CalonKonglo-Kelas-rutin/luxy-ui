import { MainLayout } from "@/components/layouts/main-layout";
import { DashboardStats } from "@/components/features/dashboard-stats";
import { DepositCollateralForm } from "@/components/features/deposit-collateral-form";
import { BorrowUsdtForm } from "@/components/features/borrow-usdt-form";
import { LoanDetails } from "@/components/features/loan-details";

export default function Page() {
  return (
    <MainLayout
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
      ]}
    >
      <div className="space-y-8 my-6">
        {/* Stats Overview */}
        <DashboardStats />

        {/* Forms Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <DepositCollateralForm />
          <BorrowUsdtForm />
        </div>

        {/* Loan Details */}
        <LoanDetails />
      </div>
    </MainLayout>
  );
}
