import { defineStore } from "pinia";
import {reactive, ref} from 'vue'

export const useUserStore = defineStore('userStore', () => {
  const user = reactive({
    username: localStorage.getItem('username') || '',
    authToken: localStorage.getItem('authToken') || '',
    firstName: localStorage.getItem('firstName') || '',
    lastName: localStorage.getItem('lastName') || '',
    email: localStorage.getItem('email') || ''
  })
  
  const selectedFriend = ref(null)

  async function createAccount(newUser) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const url = host + '/user'
    const options = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    }

    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        const result = await response.json()
        const errors = []
        if (result.errors) {
            Object.values(result.errors).forEach(err => errors.push(err.message))
        } else if (response.status === 409) {
            if (result.errorResponse && result.errorResponse.keyValue) {
                const dupField = Object.keys(result.errorResponse.keyValue)[0];
                errors.push(`Account with this ${dupField} already exists`);
            } else {
                errors.push('Account with this username or email already exists');
            }
        } else {
            errors.push('Error creating account')
        }
        return { success: false, errors }
      }
      return { success: true }
    } catch (error) {
      console.error(error)
      return { success: false, errors: ['Network error creating account'] }
    }
  }

  async function login(username, password) {
    const host = 'https://stingray-app-u3bsh.ondigitalocean.app'
    const url = host + '/user/login'
    const options = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    }

    try {
        const response = await fetch(url, options)
        
        if (!response.ok) {
            return { success: false, message: 'Invalid username or password' }
        }

        const result = await response.json()
        user.username = result.user.username
        user.authToken = result.authToken
        user.firstName = result.user.firstName || ''
        user.lastName = result.user.lastName || ''
        user.email = result.user.email || ''

        localStorage.setItem('username', result.user.username)
        localStorage.setItem('authToken', result.authToken)
        localStorage.setItem('firstName', user.firstName)
        localStorage.setItem('lastName', user.lastName)
        localStorage.setItem('email', user.email)
        
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, message: 'Network error during login' }
    }
  }

  return {user, selectedFriend, createAccount, login}
})
