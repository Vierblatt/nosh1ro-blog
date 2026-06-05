<script setup lang="ts">
</script>

<template>
  <div class="not-found">
    <h1 class="nf-code">404</h1>
    <p class="nf-text">页面不存在</p>
    <router-link to="/" class="nf-link">&larr; 返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  text-align: center;
  padding: 120px 0 80px;
}

.nf-code {
  font-size: 96px;
  font-weight: 700;
  background: linear-gradient(135deg, #58a6ff, #bc8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 16px;
}

.nf-text {
  color: #8b949e;
  font-size: 18px;
  margin-bottom: 32px;
}

.nf-link {
  color: #58a6ff;
  text-decoration: none;
  font-size: 15px;
  transition: color 0.2s;
}

.nf-link:hover {
  color: #79c0ff;
}
</style>
