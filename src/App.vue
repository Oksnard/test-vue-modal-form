<script setup>
import { ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import ModalForm from './components/ModalForm.vue'
import MainLayout from './layouts/MainLayout.vue'

const isOpen = ref(false)
const open = () => (isOpen.value = true)
const close = () => (isOpen.value = false)
</script>

<template>
  <div class="app">
    <MainLayout @open="open">
      <h1 class="page-title">Экосистема</h1>
      <p class="lead">Нажмите на кнопку чтобы оставить заявку и стать резидентом.</p>
    </MainLayout>

    <VueFinalModal
      v-model="isOpen"
      class="modal"
      content-class="modal-content"
      overlay-transition="vfm-fade"
      content-transition="vfm-fade"
      :esc-to-close="true"
      :click-to-close="true"
      @closed="close"
    >
      <ModalForm @close="close" />
    </VueFinalModal>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #f6f8fb;
  color: #1f2d3d;
}
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
}
.page-title {
  font-size: 28px;
  margin: 0 0 8px;
}
.lead {
  color: #586a7e;
}
</style>