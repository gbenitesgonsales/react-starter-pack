import AppNavigation from "@/components/root/navigation";
import { OnlyInitializedAuth } from "@/providers/auth";
import { Outlet } from "react-router";

export function DashboardLayout() {

  return (
    <OnlyInitializedAuth>
      <div className="w-full min-h-screen">
        {/* <AppHeader /> */}
        <div className="flex">
          <AppNavigation />
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </OnlyInitializedAuth>
  )
}