<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Svgs from 'virtual:svgs'
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>vite-plugin-vue-svg-sprite</h1>
      <nav>
        <RouterLink to="/">Icons</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>

    <Svgs />
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  color: #1f2937;
  background: #f8fafc;
}

.app {
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.header h1 {
  margin: 0;
  font-size: 18px;
}

nav {
  display: flex;
  gap: 16px;
}

nav a {
  color: #6b7280;
  text-decoration: none;
}

nav a.router-link-active {
  color: #2563eb;
  font-weight: 600;
}

main {
  padding: 24px;
}
</style>
