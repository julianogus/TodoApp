import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import RegistrationView from "@/views/RegistrationView.vue";
import DoneTodosView from "@/views/DoneTodosView.vue";
import VueCookies from 'vue-cookies';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Todo Home page",
            component: HomeView,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/doneTodos",
            name: "Done todos page",
            component: DoneTodosView,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/login",
            name: "Login page",
            component: LoginView,
            beforeEnter: (to,from) => {
                const hasCookie = window.$cookies.isKey('cookieMonster');
                if(hasCookie) return {path: '/'}
            }
        },
        {
            path: "/register",
            name: "Registration page",
            component: RegistrationView,
            beforeEnter: (to,from) => {
                const hasCookie = window.$cookies.isKey('cookieMonster');
                if(hasCookie) return {path: '/'}
            }
        },
        {
            path: '/:catchAll(.*)',
            name: "notFound",
            beforeEnter: (to,from) => {
                const hasCookie = window.$cookies.isKey('cookieMonster');
                if(hasCookie) return {path: '/'};
                else return {path: '/login'};
            }
        }
    ]
})

router.beforeEach((to,from) => {

    const hasCookie = window.$cookies.isKey('cookieMonster');

    if( to.meta.requiresAuth  && !hasCookie) {
        return {
            path: '/login',
            query: { redirect: to.fullPath },
        }
    }
});

export default router;