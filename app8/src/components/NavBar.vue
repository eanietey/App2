<script setup>
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore.js';
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue';

const route = useRoute()
const userStore = useUserStore()
const router = useRouter()

const showSignOut = computed(() => {
  return userStore.user.username && route.name === 'home'
})

const showAuthLinks = computed(() => {
  return !showSignOut.value
})

const showProfile = ref(false)

function toggleProfile() {
  showProfile.value = !showProfile.value
}

function signOut() {
  const isConfirmed = confirm("Are you sure you want to sign out?")
  if (isConfirmed) {
    localStorage.removeItem('username')
    localStorage.removeItem('authToken')
    localStorage.removeItem('firstName')
    localStorage.removeItem('lastName')
    localStorage.removeItem('email')
    
    userStore.user.username = ''
    userStore.user.authToken = ''
    userStore.user.firstName = ''
    userStore.user.lastName = ''
    userStore.user.email = ''
    
    router.push('/login')
  }
}
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

          <template v-if="showSignOut">
            <span class="username-display" @click="toggleProfile" title="View Profile">
              {{ userStore.user.username }}
            </span>
            <button class="signout" @click="signOut"> Sign Out </button>
          </template>
        </span>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showProfile" class="background-blur" @click.self="showProfile = false">
        <div class="profile-card">
          <div class="profile-header">
            <h3>User Profile</h3>
            <button class="close-btn" @click="showProfile = false">×</button>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <label>First Name</label>
              <p>{{ userStore.user.firstName || 'Not provided' }}</p>
            </div>
            <div class="info-item">
              <label>Last Name</label>
              <p>{{ userStore.user.lastName || 'Not provided' }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ userStore.user.email || 'Not provided' }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
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

.username-display {
  color: #0ea5e9;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-right: 4px;
}

.username-display:hover {
  background-color: #f0f9ff;
  text-decoration: underline;
}

.background-blur {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.profile-card {
  background: white;
  width: 320px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

.profile-header {
  background: #0ea5e9;
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.profile-info {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  color: #64748b;
  font-weight: 700;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.info-item p {
  margin: 0;
  color: #1e293b;
  font-size: 15px;
  font-weight: 500;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
