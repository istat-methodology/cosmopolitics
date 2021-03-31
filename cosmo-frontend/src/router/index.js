import Vue from "vue";
import VueRouter from "vue-router";

import store from "@/store";

import Error from "@/views/error/Error";
import Unauthorized from "@/views/error/Unauthorized";
import Home from "@/views/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: () => import("../views/auth/Login"),
    meta: { authorize: [] }
  },
  {
    path: "/register",
    component: () => import("../views/auth/Register"),
    meta: { authorize: [] }
  },
  {
    path: "/error",
    component: Error,
    meta: { authorize: [] }
  },
  {
    path: "/unauthorized",
    component: Unauthorized,
    meta: { authorize: [] }
  },
  {
    path: "/",
    redirect: "/catalogue",
    name: "Home",
    component: Home,
    meta: { authorize: [] },
    children: [
      {
        path: "catalogue",
        name: "Catalogue",
        component: () => import("../views/catalogue/Catalogue"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/map",
        name: "Map",
        component: () => import("../views/catalogue/map/GeoMap"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/graph",
        name: "Graph",
        component: () => import("../views/catalogue/graph/GraphForm"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/graphplus",
        name: "GraphPlus",
        component: () => import("../views/catalogue/graph/GraphFormPlus"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/graphslider",
        name: "GraphSlider",
        component: () => import("../views/catalogue/graph/GraphSlider"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/bar",
        name: "ChartjsBar",
        component: () => import("../views/catalogue/chartjs/ChartjsBar"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/policy",
        name: "Policy",
        component: () => import("../views/catalogue/chartjs/ChartjsScatter"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/bec",
        name: "Bec",
        component: () => import("../views/catalogue/bec/Bec"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/mobility",
        name: "Mobility",
        component: () => import("../views/catalogue/mobility/Mobility"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/line",
        name: "Trade",
        component: () => import("../views/catalogue/chartjs/ChartjsLine"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/geomap",
        name: "GeoMap",
        component: () => import("../views/catalogue/map/GeoMap"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/user",
        name: "UserList",
        component: () => import("../views/settings/user/UserList"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/user/edit/:id",
        name: "UserEdit",
        component: () => import("../views/settings/user/UserEdit"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/user/delete/:id",
        name: "UserDelete",
        component: () => import("../views/settings/user/UserDelete"),
        meta: { authorize: [] }
      },
      {
        path: "catalogue/user/add/",
        name: "UserAdd",
        component: () => import("../views/settings/user/UserAdd"),
        meta: { authorize: [] }
      }
    ]
  },
  { path: "*", redirect: "/" }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  // redirect to unauthorized page if not logged in and trying to access a restricted page
  const { authorize } = to.meta;
  const isAuthenticated = store.getters["auth/isAuthenticated"];
  const userRole = store.getters["auth/role"];

  if (authorize.length) {
    if (!isAuthenticated || !authorize.includes(userRole)) {
      const err = {
        code: 401,
        message: "You cannot access this page!"
      };
      store.dispatch("error/unauthorized", err);
    }
  }

  next();
});

export default router;
