<script setup lang="ts">
import { ref } from 'vue'
import SvgIcon from 'virtual:svg-icon'

const activeIcon = ref('add')
</script>

<template>
  <div class="about">
    <h2>About</h2>
    <p>示例项目用于本地开发调试插件，验证按需加载与 SVG 热更新。</p>

    <div class="demo">
      <SvgIcon name="add" color="#2563eb" class="icon" />
      <SvgIcon name="score" color="#dc2626" class="icon" />
      <SvgIcon name="menu" title="菜单" class="icon" />
      <SvgIcon :name="activeIcon" class="icon accent" :lazy="false" />
    </div>

    <div class="controls">
      <button type="button" @click="activeIcon = 'add'">add</button>
      <button type="button" @click="activeIcon = 'score'">score</button>
      <button type="button" @click="activeIcon = 'menu'">menu</button>
    </div>

    <p class="note">
      支持 <code>color</code> prop、<code>title</code> 无障碍标签，以及动态切换
      <code>name</code>。
    </p>
  </div>
</template>

<style scoped>
.about h2 {
  margin: 0 0 8px;
  font-size: 16px;
}

.about p {
  margin: 0 0 16px;
  color: #4b5563;
}

.demo {
  display: flex;
  gap: 24px;
  align-items: center;
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.controls {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.controls button {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.icon {
  width: 40px;
  height: 40px;
}

.icon.accent {
  color: #7c3aed;
}

.note {
  margin-top: 12px !important;
  font-size: 14px;
}

.note code {
  padding: 2px 6px;
  background: #f3f4f6;
  border-radius: 4px;
}
</style>
