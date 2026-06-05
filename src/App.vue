<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <div class="page">
    <NavBar />
    <main>
      <RouterView />
    </main>
    <FooterBar />
  </div>
</template>

<style scoped>
.page {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px 64px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

@media (max-width: 640px) {
  .page { padding: 0 12px 48px; }
}
</style>
