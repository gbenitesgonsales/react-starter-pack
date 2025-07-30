import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";

export function RootLayout() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="p-2 bg-muted border-b">
        <Link to="/">
          <Button variant="link">Example.tsx</Button>
        </Link>
        <Link to="/github">
          <Button variant="link">Github</Button>
        </Link>
      </div>
      <Outlet />
    </div>
  )
}