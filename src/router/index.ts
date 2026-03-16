import { createRouter, createWebHistory } from "vue-router";
import AnalyzeScreen from "../components/AnalyzeScreen.vue";
import IntakeScreen from "../components/IntakeScreen.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: '/analyze/org',
    },
    {
      path: "/analyze/:tier/:id?",
      name: "Analyze",
      component: AnalyzeScreen,
    },
    {
      path: "/intake/:tier/:id?",
      name: "Intake",
      component: IntakeScreen,
    },
  ],
});
export default router;
