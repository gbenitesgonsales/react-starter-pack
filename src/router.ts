import { createBrowserRouter } from "react-router";
import { Example } from "./Example";
import { GithubPage } from "./pages/github";
import { RootLayout } from "./pages/root-layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Example,
      },
      {
        path: "/github",
        Component: GithubPage
      }
    ]
  },
]);
