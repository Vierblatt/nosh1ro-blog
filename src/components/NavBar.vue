<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="nav-brand">nosh1ro</RouterLink>
    <div class="nav-links">
      <RouterLink to="/">首页</RouterLink>
      <a href="/api/feed.xml" target="_blank" rel="noopener">RSS</a>
      <RouterLink to="/admin">管理</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #30363d;
  margin-bottom: 32px;
}

.nav-brand {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #58a6ff, #bc8cff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-links a {
  color: #8b949e;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #e6edf3;
}
</style>
