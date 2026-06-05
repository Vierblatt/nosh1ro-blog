import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '../api/admin'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: () => import('../pages/PostPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../pages/RegisterPage.vue'),
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('../pages/VerifyEmailPage.vue'),
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../pages/AdminLogin.vue'),
      beforeEnter: () => {
        if (isLoggedIn()) return { path: '/admin' }
      },
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../pages/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/posts/new',
      name: 'admin-post-new',
      component: () => import('../pages/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/posts/:id/edit',
      name: 'admin-post-edit',
      component: () => import('../pages/AdminDashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('../pages/AdminSettings.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { path: '/admin/login', query: { redirect: to.fullPath } }
  }
})

export default router
