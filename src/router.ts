import { createBrowserRouter } from "react-router";
import LoginPage from "./pages/auth/page";
import { DashboardLayout } from "./pages/dashboard-layout";
import { HomePage } from "./pages/home";
import { RootLayout } from "./pages/root-layout";
import { TicketsPage } from "./pages/tickets";
import { CreateTicketPage } from "./pages/tickets/create";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "login",
        Component: LoginPage
      },
      {
        path: "",
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: HomePage,
          },
          {
            path: "tickets",
            Component: TicketsPage,
          },
          {
            path: "tickets/new",
            Component: CreateTicketPage,
          },
        ]
      },

    ]
  },
]);
