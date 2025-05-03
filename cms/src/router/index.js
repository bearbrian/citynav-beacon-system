import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Users from "../views/Users.vue";
import Attractions from "../views/Attractions.vue";
import Spots from "../views/Spots.vue";
import Beacons from "../views/Beacons.vue";

export const isAuthenticated = ref(false);
export const user = ref(null);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/index.html",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/users",
    name: "Users",
    component: Users,
    meta: { requiresAuth: true },
  },
  {
    path: "/attractions",
    name: "Attractions",
    component: Attractions,
    meta: { requiresAuth: true },
  },
  {
    path: "/spots",
    name: "Spots",
    component: Spots,
    meta: { requiresAuth: true },
  },
  {
    path: "/beacons",
    name: "Beacons",
    component: Beacons,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/");
  } else {
    next();
  }
});

export default router;
