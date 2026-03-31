<script setup>
</script>

<template>
 <div class="view">
   <div class="logo">
      <span class="f-large">F</span>
      <span class="rapp-small">rapp</span>
   </div>
 </div>
</template>

<style scoped>
.view{
  height: 100vh;
  width: 100%;
  background-color: #e0f2fe;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo{
  width: 300px;
  height: 300px;
  border-radius: 20px;
  background-color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: -2px;
}

.f-large {
  font-size: 150px;
  font-weight: 800;
  line-height: 1;
}

.rapp-small {
  font-size: 60px;
  font-weight: 600;
  margin-top: 40px;
  letter-spacing: 1px;
}
</style>
