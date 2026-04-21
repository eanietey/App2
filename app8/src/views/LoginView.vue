<script setup>
import {ref, computed} from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore.js';
import { users } from '../data/data.js';

const checkUsername = (value) => {
  const errors = []

  if(value.length < 5) errors.push("Must have at least 5 characters")

  if (!/^[a-zA-Z]/.test(value)) {
    errors.push('Must begin with a letter')
  }

  for (let w of value) {
    if (!((w >= 'a' && w <= 'z') ||
          (w >= 'A' && w <= 'Z') ||
          (w >= '0' && w <= '9'))) {
      errors.push('Can only contain letters and numbers')
      break
    }
  }

   return errors
}

const checkPasssword =(value) => {
  const errors = []

  const v = value ? value.trim(): ''

  if(v.length < 8) errors.push("Must have at least 8 characters")
  if (v.length > 64) errors.push('Cannot have more than 64 characters')
  if (!v.match(/[A-Z]/)) errors.push('Must have 1 uppercase character')
  if (!v.match(/[a-z]/)) errors.push('Must have 1 lowercase character')
  if (!v.match(/[0-9]/)) errors.push('Must have 1 number')
  if (!v.match(/[!@#$%^&*(),.?":{}|<>]/)) errors.push('Must have 1 special character')
  return errors
}

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const username = ref('')
const password = ref('')
const isCreated = computed(() => route.query.created === 'true')
const apiError = ref('')

const usernameErrors = computed(() => checkUsername(username.value))
const passwordErrors = computed(() => checkPasssword(password.value))
const hasErrors = computed(() => usernameErrors.value.length > 0 || passwordErrors.value.length > 0)

async function login() {
  apiError.value = ''
  if (hasErrors.value) return;

  const foundUser = users.find(
    user =>
      user.username === username.value &&
      user.password === password.value
  )

  if (foundUser) {
    userStore.user.username = foundUser.username
    localStorage.setItem('username', foundUser.username)
    router.push('/homepage')
    return
  }

  const result = await userStore.login(username.value, password.value)

  if (result.success) {
    router.push('/homepage')
  } else {
    apiError.value = result.message || 'Invalid username or password'
  }
}


</script>

<template>
  <div class="login-page">
    <div :class="['login-tab', { 'no-errors': !hasErrors && !apiError }]">
      <div class="login-form">
        <h1>Log In</h1>
        <h5> Welcome to Frapp</h5>
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


      <div :class="['error-messages', {'no-width': !hasErrors}]">
        <div>
          <span v-show="usernameErrors.length > 0">
            Username
            <ul>
              <li v-for="error in usernameErrors" :key="error">
                <span>{{ error }}</span>
              </li>
            </ul>
          </span>
        </div><br>
        <div>
          <span v-show="passwordErrors.length > 0">
            Password
            <ul>
              <li v-for="error in passwordErrors" :key="error">
                <span>{{ error }}</span>
              </li>
            </ul>
          </span>
        </div>
        <div>
          <span v-show="apiError">
            <ul>
              <li><span>{{ apiError }}</span></li>
            </ul>
          </span>
        </div>
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
  height: 300px;
  background-color: #f8fafc;
  padding: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  transition: all 0.5s ease;
  overflow: hidden;
}

.login-tab.no-errors {
  gap: 0;
}

.login-form{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 250px;
  height: inherit;
  background-color: #0ea5e9;
  color: white;
  border-radius: 8px;
  flex-direction: column;
  transition: all 0.5s ease;
}

.no-width{
  width: 0 !important;
  opacity: 0;
  margin: 0;
  padding: 0;
}

h1{
  margin-top: 20px;
}

h1, h5{
  margin: 0;
}

.error-messages{
  align-self: center;
  color: red;
  font-size: 12px;
  width: 200px;
  transition: all 1s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  white-space: nowrap;
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
