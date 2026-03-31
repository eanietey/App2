<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <div class="error-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>Oops! The page you are looking for doesn't exist or has been moved.</p>
      <button @click="goHome" class="btn-home">Return to Homepage</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  background-color: #e0f2fe;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.error-container {
  background-color: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

h1 {
  font-size: 80px;
  color: #0ea5e9;
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 24px;
  color: #334155;
  margin: 10px 0;
}

p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 30px;
}

.btn-home {
  padding: 10px 20px;
  background-color: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-home:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
</style>
