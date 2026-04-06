<template>
  <span class="bee-icon-shell" aria-hidden="true">
    <img
      v-if="!iconLoadFailed"
      :src="beeIconUrl"
      alt=""
      class="w-16 h-12 "
      decoding="async"
      @error="iconLoadFailed = true"
    />
    <span
      v-else
      class="bee-icon-fallback"
    >
      🐝
    </span>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const beeIconUrl = '/BeeAI.png'
const iconLoadFailed = ref(false)
</script>

<style scoped>
.bee-icon-shell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  overflow: hidden;
  line-height: 1;
}

.bee-icon-shell img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.bee-icon-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
