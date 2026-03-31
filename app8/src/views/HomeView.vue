<script setup>
import MainComp from '@/components/MainComp.vue';
import SideBar from '@/components/SideBar.vue';
</script>

<template>
  <div class="home-view">
    <SideBar/>
    <MainComp/>
 </div>
</template>

<style scoped>
.home-view {
  margin-top: 10px;;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

</style>
