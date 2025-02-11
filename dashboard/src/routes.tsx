import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdBarChart,
  MdDashboard,
  MdEditDocument,
  MdHome, MdList,
  MdLock,
  MdOutlineShoppingCart,
  MdPerson,
} from "react-icons/md";
import Dashboard from "./views/dashboard/Dashboard";
import Templates from "./views/templates/Templates";
import EmailsLogs from "./views/emailLogs/EmailsLogs";

const routes = [
  {
    name: "Notifications Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <Dashboard />,
  },
  {
    name: "Email templates",
    layout: "/admin",
    path: "templates",
    icon: <MdEditDocument className="h-6 w-6" />,
    component: <Templates />,
  },
  {
    name: "Email logs",
    layout: "/admin",
    path: "logs",
    icon: <MdList className="h-6 w-6" />,
    component: <EmailsLogs />,
  },
  {
    name: "Overview",
    layout: "/admin",
    path: "overview",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Marketplace",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineShoppingCart className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
