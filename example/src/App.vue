<script setup lang="ts">
import { vCustomHighlight } from "@kamiazya/vue-custom-highlight";
import { ref } from "vue";

import sample from "./assets/sample.txt?raw";
const keyword = ref<string>('e');

const text = ref(sample);
</script>

<template>
  <input v-model="keyword" type="search" />
  <div v-custom-highlight="keyword">{{ text }}</div>
</template>

<style>
::highlight(v-custom-highlight) {
  background-color: yellow;
}
</style>
