import { vHighlight } from '@kamiazya/vue-highlight'; // Import the 'Keyword' type
import { createApp } from 'vue';

import App from './src/App.vue';

const app = createApp(App);
// @ts-ignore
app.directive('highlight', vHighlight);
app.mount('#container');
