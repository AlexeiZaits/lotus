import {
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import App from "../ui/App";
import { MainPage } from "pages/MainPage";

export const router = createBrowserRouter([
  { 
    element: <App><Outlet/></App>,
    children: [
      { 
        path: "/",
        element: <MainPage/>
        ,
      }      
    ]
  },
]);
