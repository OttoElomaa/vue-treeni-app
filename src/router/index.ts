import { createRouter, createWebHistory } from "vue-router";
import AnalyzeScreen from "../components/AnalyzeScreen.vue";
import IntakeScreen from "../components/IntakeScreen.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: '/analyze',
    },
    {
      path: "/analyze",
      name: "analyze",
      component: AnalyzeScreen,
    },
    {
      path: "/intake",
      name: "intake",
      component: IntakeScreen,
    },
  ],
});
export default router;
