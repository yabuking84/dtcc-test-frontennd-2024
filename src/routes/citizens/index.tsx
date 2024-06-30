import { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";
import { Template as Layout } from "@/views/layouts/default/template";
import { Component as Error } from "@/views/pages/error";

import {route as CitizensRoute} from "./citizens"

export const route: IndexRouteObject | NonIndexRouteObject = {
    path: '/',
    errorElement: <Error/>,
    element: <Layout />,
    children: [
        CitizensRoute,
    ]
}
