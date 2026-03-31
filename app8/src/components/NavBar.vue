<script setup>
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore.js';
import { useRouter } from 'vue-router'
import { computed } from 'vue';

const route = useRoute()
const userStore = useUserStore()
const router = useRouter()

function signOut() {
  const isConfirmed = confirm("Are you sure you want to sign out?")
  if (isConfirmed) {
    localStorage.removeItem('username')
    userStore.user.username = ''
    router.push('/login')
  }
}

const showSignOut = computed(() => {
  return userStore.user.username && route.name === 'home'
})

const showAuthLinks = computed(() => {
  return !showSignOut.value
})
</script>

<template>
  <nav>
    <div class="header">
      <div class="name">
        <span class="link1">
          <RouterLink to="/welcomepage">Frapp</RouterLink>
        </span>
      </div>
      <div class="opt">
        <span class="links">
          <RouterLink  v-if="showAuthLinks" v-show="route.path !== '/login'" to="/login" class="single">Login</RouterLink>

          <RouterLink v-if="showAuthLinks" v-show="route.path !== '/createaccount'" to="/createaccount" class="single">Create Account</RouterLink>

          <button v-if="showSignOut" class="signout" @click="signOut"> Sign Out </button>
        </span>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  width: 100%;
  height: 60px;
  background-color: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.header {
  height: inherit;
  width: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-sizing: border-box;
}

.name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

span a, .signout {
  color: #334155;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
}

.link1 a {
  padding: 8px 16px;
  border-radius: 8px;
}

.single {
  margin: 0 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.single:hover {
  background-color: #f1f5f9;
  color: #0ea5e9;
}

.signout {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-left: 8px;
}

.signout:hover {
  background-color: #fee2e2;
  color: #ef4444;
}
</style>
