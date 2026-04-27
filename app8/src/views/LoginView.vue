<script setup>
import {ref, computed} from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore.js';
import { users } from '../data/data.js';

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const isCreated = computed(() => route.query.created === 'true')
const apiError = ref('')

const hasErrors = computed(() => !username.value.trim() || !password.value.trim())

async function login() {
  apiError.value = ''

  const trimmedUsername = username.value.trim()
  const trimmedPassword = password.value.trim()

  if (!trimmedUsername || !trimmedPassword) return;

  const foundUser = users.find(
    user =>
      user.username === trimmedUsername &&
      user.password === trimmedPassword
  )

  if (foundUser) {
    userStore.user.username = foundUser.username
    localStorage.setItem('username', foundUser.username)
    router.push('/homepage')
    return
  }

  const result = await userStore.login(trimmedUsername, trimmedPassword)

  if (result.success) {
    router.push('/homepage')
  } else {
    apiError.value = 'Invalid credentials'
  }
}

</script>

<template>
  <div class="login-page">
    <div class="login-tab">
      <div class="login-form">
        <div class="login-header">
          <h1>Log In</h1>
          <h5> Welcome to Frapp</h5>
        </div>
        <div v-if="apiError" class="error-msg">
          {{ apiError }}
        </div>
        <div v-if="isCreated" class="success-message">
          An account has been created, please log in.
        </div>
        <div class="form-item">
          <label for="usernameInput">Username</label><br>
          <input id="usernameInput" v-model="username" type="text" />
        </div>
        <div class="form-item">
            <label for="passwordInput">Password</label><br>
            <input
              id="passwordInput"
              v-model="password"
              type="password"
              @keyup.enter="login"
            />
          </div>
          <button @click="login">Sign in</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page{
  background-color: #e0f2fe;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-tab{
  min-height: 300px;
  background-color: #f8fafc;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.login-form{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 250px;
  padding: 30px 20px;
  background-color: #0ea5e9;
  color: white;
  border-radius: 8px;
  flex-direction: column;
}

.login-header {
  text-align: center;
}

.login-header h1, .login-header h5 {
  margin: 0;
}

.login-header h5 {
  opacity: 0.9;
  font-weight: 400;
}

.error-msg {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  font-weight: 500;
}

.position{
  float: right;
}

button{
  width: 70px;
  padding: 10px;
  cursor: pointer;
  background-color: #f1f5f9;
  color: #0ea5e9;
  border: none;
  font-weight: bold;
  border-radius: 6px;
  transition: background-color 0.2s;
}

button:hover {
  background-color: white;
}

.success-message {
  color: #10b981;
  background-color: #ecfdf5;
  padding: 8px;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>
