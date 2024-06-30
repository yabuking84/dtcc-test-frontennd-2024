import { IndexRouteObject, NonIndexRouteObject } from "react-router-dom";

export const route: IndexRouteObject | NonIndexRouteObject = {
    path: '/',
    lazy: () => import("@/views/pages/citizens"),
}