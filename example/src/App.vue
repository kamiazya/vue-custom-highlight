<script setup lang="ts">
import { vHighlight } from '@kamiazya/vue-highlight';
import { ref } from "vue";

import sample from "./assets/sample.txt?raw";
const keyword = ref<string>('e');

const text = ref(sample);
</script>

<template>
  <input v-model="keyword" type="search" />
  <div v-highlight="keyword">{{ text }}</div>
</template>

<style>
::highlight(v-highlight) {
  background-color: yellow;
}
</style>
