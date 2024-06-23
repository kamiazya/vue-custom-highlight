[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

# @kamiazya/vue-highlight ✨

Vue(3+) directive for highlighting keywords in text.

> You can highlight matching keywords in the text within a given element with your own CSS.
> Internally, it uses the [Custom Highlighting API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API), so it does not corrupt the DOM.

## Installation 📥

```bash
# By npm
$ npm install @kamiazya/vue-highlight
# By yarn
$ yarn add @kamiazya/vue-highlight
# By pnpm
$ pnpm add @kamiazya/vue-highlight
```

## Usage 📘

### Basic usage

Highlight the keyword `"bar"` in the text `"foo bar baz"`.

```vue
<script setup>
import { ref } from "vue";
import vHighlight from "@kamiazya/vue-highlight";

const keyword = ref("bar");
</script>

<template>
  <div v-highlight="keyword">
    foo bar baz
  </div>
</template>
<style>
::highlight(v-highlight) {
  background-color: yellow;
  color: black;
}
</style>
```

If you want to use `v-highlight` directive in global, you can register the `vHighlight` direvtive to app instance.

```ts
import { vHighlight } from '@kamiazya/vue-highlight'; // Import the directive
import { createApp } from 'vue';

import App from './src/App.vue';

const app = createApp(App);
app.directive('highlight', vHighlight); // Register the directive
app.mount('#container');
```

### Multiple keywords

Highlight the keywords `"foo"` and `"baz"` in the text `"foo bar baz"`.

```vue
<script setup>
import { ref } from "vue";
import vHighlight from "@kamiazya/vue-highlight";

const keyword = ref(["foo", "baz"]);
</script>

<template>
<div v-highlight="keyword">
  foo bar baz
</div>
</template>
<style>
::highlight(v-highlight) {
  background-color: yellow;
  color: black;
}
</style>
```

### Custom highlight name

Highlight the keyword `"bar"` in the text `"foo bar baz"` with a custom highlight name.

```vue
<script setup>
import { ref } from "vue";
import vHighlight from "@kamiazya/vue-highlight";

const keyword = ref("bar");
</script>

<template>
<div v-highlight:my-custom-highlight="keyword">
foo bar baz
</div>
</template>
<style>
::highlight(my-custom-highlight) {
  background-color: yellow;
  color: black;
}
</style>
```

### Multiple highlights

Highlight the keywords `"foo"` and `"baz"` in the text `"foo bar baz"` with multiple highlights.

```vue
<script setup>
import { ref } from "vue";
import vHighlight from "@kamiazya/vue-highlight";

const keyword1 = ref("bar");
const keyword2 = ref("foo");
</script>

<template>
<div
  v-highlight:highlight1="keyword1"
  v-highlight:highlight2="keyword2"
>
foo bar baz
</div>
</template>
<style>
::highlight(highlight1) {
  background-color: yellow;
  color: black;
}
::highlight(highlight2) {
  background-color: red;
  color: white;
}
</style>
```

## License ⚖️

This software is released under the MIT License, see [LICENSE](./LICENSE).
