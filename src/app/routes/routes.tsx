import {
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import App from "../ui/App";
import { MainPage } from "pages/MainPage";
import { AuctionTable } from "widjets/index";

export const router = createBrowserRouter([
  { 
    element: <App><Outlet/></App>,
    children: [
      { 
        path: "/",
        element: <MainPage/>
      },
      {
        path: "/auction/:auctionName/:id",
        element: <AuctionTable/>,
      },
    ]
  },
]);
