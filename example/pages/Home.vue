<script setup lang="ts">
import SvgIcon from 'virtual:svg-icon'

const previewIcons = ['add', 'menu', 'score', 'download']

const lazyIcons = [
  'logo1',
  'logo2',
  'logo3',
  'logo4',
  '404',
  'en',
  'f',
  'facebook',
  'ins',
  'pentagram',
  'rightArrow',
  'safety',
  'tg',
  'tip',
  'x',
]
</script>

<template>
  <div class="page">
    <section class="tips">
      <h2>开发调试</h2>
      <ul>
        <li>修改 <code>example/assets/svg/*.svg</code> 后保存，页面会自动刷新</li>
        <li>新增或重命名 SVG 后同样会触发热更新</li>
        <li>向下滚动可验证懒加载（图标进入视口后才请求）</li>
      </ul>
    </section>

    <section class="preview">
      <h2>即时预览（关闭懒加载）</h2>
      <p class="hint">进入页面即可看到图标，方便确认插件是否正常工作。</p>
      <div class="grid">
        <div v-for="name in previewIcons" :key="name" class="item">
          <SvgIcon :name="name" :lazy="false" class="icon" />
          <span>{{ name }}</span>
        </div>
      </div>
    </section>

    <div class="spacer">
      <span>向下滚动，测试懒加载</span>
    </div>

    <section class="gallery">
      <h2>懒加载图标</h2>
      <div class="grid">
        <div v-for="name in lazyIcons" :key="name" class="item">
          <SvgIcon :name="name" class="icon" />
          <span>{{ name }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.tips,
.preview,
.gallery {
  margin-bottom: 24px;
}

.tips {
  padding: 16px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}

.tips h2,
.preview h2,
.gallery h2 {
  margin: 0 0 8px;
  font-size: 16px;
}

.tips ul {
  margin: 0;
  padding-left: 20px;
}

.tips code {
  padding: 2px 6px;
  background: #dbeafe;
  border-radius: 4px;
  font-size: 13px;
}

.hint {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 14px;
}

.spacer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
  margin: 24px 0;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  color: #64748b;
  font-size: 14px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 16px;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.icon {
  width: 32px;
  height: 32px;
  color: #2563eb;
}

.item span {
  font-size: 12px;
  color: #6b7280;
  word-break: break-all;
  text-align: center;
}
</style>
