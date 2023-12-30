import { createRouter, createWebHashHistory, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import routes from './module/base-routes'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from "../store/user";

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/**
 * Router 前置拦截
 * 
 * 1.验证 token 存在, 并且有效, 否则 -> login.vue
 * 2.验证 permission 存在, 否则 -> 403.vue
 * 3.验证 router 是否存在, 否则 -> 404.vue
 * 
 * @param to 目标
 * @param from 来至 
 */
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  NProgress.start();

  const userStore = useUserStore();
  // token不存在，且目标路径不是login，返回到登录页
  if (!userStore.token && !to.path.startsWith('/login')) {
    next({path: '/login'})
    return;
  }

  if(to.meta.requireAuth) {
    next();
  } else if(to.matched.length == 0) {
    next({path: '/error/404'})
  }  else {
    next();
  }
})

router.afterEach(() => {
  NProgress.done();
})

export default router