import { vHighlight } from '@kamiazya/vue-highlight'; // Import the directive
import { createApp } from 'vue';

import App from './src/App.vue';

const app = createApp(App);
// @ts-ignore
app.directive('highlight', vHighlight); // Register the directive
app.mount('#container');
