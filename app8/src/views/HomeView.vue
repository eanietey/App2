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
  box-sizing: border-box;
  width: 100%;
  height: calc(100vh - 61px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
}
</style>
