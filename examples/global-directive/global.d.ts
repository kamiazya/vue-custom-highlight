import type { vHighlight } from '@kamiazya/vue-highlight';

declare module '@vue/runtime-core' {
  interface GlobalDirectives {
    vHighlight: typeof vHighlight;
  }
}
