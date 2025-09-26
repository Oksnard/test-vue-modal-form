<script setup>
import SiteHeader from '../components/SiteHeader.vue'
const emit = defineEmits(['open'])
</script>

<template>
  <div class="layout">
    <SiteHeader @open="emit('open')" />
    <main class="main">
      <div class="container">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  background: #f6f8fb;
  color: #1f2d3d;
}
.main {
  padding: 48px 0;
}
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
