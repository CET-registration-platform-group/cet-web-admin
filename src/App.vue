<script setup lang="ts">
import { StagewiseToolbar } from '@stagewise/toolbar-vue'
import { computed } from 'vue'

const stagewiseConfig = {
  plugins: []
}

const isDev = computed(() => import.meta.env.DEV)
</script>

<template>
  <router-view />
  <StagewiseToolbar v-if="isDev" :config="stagewiseConfig" />
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: linear-gradient(135deg, #3a7bd5 0%, #9d50bb 100%);
}

#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

