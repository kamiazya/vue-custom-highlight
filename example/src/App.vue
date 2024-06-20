<script setup lang="ts">
import { vCustomHighlight } from "@kamiazya/vue-custom-highlight";
import { ref } from "vue";

const keyword = ref("a");
</script>

<template>
  <input v-model="keyword" type="search" />
  <div v-custom-highlight:custom="keyword">
    <p>ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
    <p>abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz</p>
    <p>01234567890123456789</p>
    <p>あいうえおかきくけこさしすせそたちつてとなにぬねの</p>
    <p>アイウエオカキクケコサシスセソタチツテトナニヌネノ</p>
    <p>亜伊宇江於加木久介子糸須世曽多知都天止奈仁奴禰乃</p>
  </div>
</template>

<style scoped>
::highlight(custom) {
  background-color: yellow;
}
</style>
