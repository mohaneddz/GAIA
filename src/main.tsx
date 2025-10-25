import "@/style/Theme.css";
import "@/style/App.css";
import "@/style/Titlebar.css";
import "@/style/Utils.css";

import ReactDOM from "react-dom/client";
import App from "./App";

import Titlebar from "./layout/Titlebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "./layout/app-sidebar";
import AddToFolder from "@/components/AddToFolder";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div className="screen max-w-screen overflow-x-hidden">
    <Titlebar />

    <SidebarProvider>

      <AppSidebar />
      <SidebarInset>
        <App />
        <AddToFolder currentPage={window.location.pathname} />
      </SidebarInset>

    </SidebarProvider>
  </div>
);

