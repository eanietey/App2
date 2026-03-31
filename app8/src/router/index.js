import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import PageNotFoundView from '../views/PageNotFoundView.vue'
import CreateAccount from '../views/CreateAccount.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/welcomepage'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/homepage',
      name: 'home',
      component: HomeView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/welcomepage',
      name: 'welcome',
      component: WelcomeView
    },
    {
      path: '/createaccount',
      name: 'createAccount',
      component: CreateAccount
    },
    {
      path: '/:pathMatch(.*)*',
      component: PageNotFoundView,
    },
  ],
})

export default router
