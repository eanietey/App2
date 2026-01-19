<template>
  <div class="parent">
    <slot name="first"></slot>
  </div>
</template>

<style scoped>
.parent {
  width: 100%;
  height: 100vh;
  gap: 2px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 9px;
}

:deep(.box) {
  width: 100%;
  height: 100%;
  border: none;
  flex-shrink: 1;
  box-sizing: border-box;
}
</style>
