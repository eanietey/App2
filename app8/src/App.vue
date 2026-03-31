<script setup>
import NavBar from './components/NavBar.vue';
</script>

<template>
 <div class="app">
  <NavBar/>
  <RouterView />
 </div>
</template>

<style scoped>
*{
  box-sizing: border-box;
}

html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}



</style>
