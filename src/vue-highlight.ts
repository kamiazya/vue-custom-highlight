import type { Directive, DirectiveHook } from "vue";
import { escapeRegExp } from "./utils/escapeRegExp.js";

export type Keyword = undefined | string | string[];

function toArray(arrayOrItem: string | string[]) {
  return Array.isArray(arrayOrItem) ? arrayOrItem : [arrayOrItem];
}

function* walkTextNodes(el: HTMLElement): Generator<Text> {
  const treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let currentNode: Node | null;
  while ((currentNode = treeWalker.nextNode()) !== null) {
    yield currentNode as Text;
  }
}

function matchKeywordsRanges(text: Text, keywords: string[]): Range[] {
  if (!text.textContent) {
    return [];
  }
  const ranges: Range[] = [];
  for (const keyword of keywords) {
    const matcher = new RegExp(escapeRegExp(keyword), "g");
    let match: RegExpExecArray | null;
    while ((match = matcher.exec(text.textContent)) !== null) {
      const range = new Range();
      range.setStart(text, match.index);
      range.setEnd(text, match.index + match[0].length);
      ranges.push(range);
    }
  }
  return ranges;
}

const DEFAULT_HIGHLIGHT_NAME = "v-highlight";

const applyHighlight: DirectiveHook<HTMLElement, any, Keyword> = (
  el,
  { arg: name = DEFAULT_HIGHLIGHT_NAME, value: keyword },
) => {
  CSS.highlights.delete(name);
  const keywords = keyword ? toArray(keyword) : [];
  const ranges: Range[] = [...walkTextNodes(el)].flatMap((text) =>
    matchKeywordsRanges(text, keywords),
  );
  if (ranges.length >= 0) {
    CSS.highlights.set(name, new Highlight(...ranges));
  }
};

const removeHighlight: DirectiveHook<HTMLElement, any, Keyword> = (
  _,
  { arg: name = DEFAULT_HIGHLIGHT_NAME },
) => {
  CSS.highlights.delete(name);
};

/**
 * Highlight directive.
 *
 * You can highlight matching keywords in the text within a given element with your own CSS.
 *
 * Internally, it uses the [Custom Highlighting API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Custom_Highlight_API), so it does not corrupt the DOM.
 *
 * @example **Basic usage:** Highlight the keyword "bar" in the text "foo bar baz".
 *
 * ```vue
 * <script setup>
 * import { ref } from "vue";
 * import vHighlight from "@kamiazya/vue-highlight";
 *
 * const keyword = ref("bar");
 * </script>
 *
 * <template>
 *   <div v-highlight="keyword">
 *     foo bar baz
 *   </div>
 * </template>
 * <style>
 * ::highlight(v-highlight) {
 *   background-color: yellow;
 *   color: black;
 * }
 * </style>
 * ```
 *
 * @example **Multiple keywords:** Highlight the keywords "foo" and "baz" in the text "foo bar baz".
 *
 * ```vue
 * <script setup>
 * import { ref } from "vue";
 * import vHighlight from "@kamiazya/vue-highlight";
 *
 * const keyword = ref(["foo", "baz"]);
 * </script>
 *
 * <template>
 *  <div v-highlight="keyword">
 *   foo bar baz
 * </div>
 * </template>
 * <style>
 * ::highlight(v-highlight) {
 *   background-color: yellow;
 *   color: black;
 * }
 * </style>
 * ```
 *
 * @example **Custom highlight name:** Highlight the keyword "bar" in the text "foo bar baz" with a custom highlight name.
 *
 * ```vue
 * <script setup>
 * import { ref } from "vue";
 * import vHighlight from "@kamiazya/vue-highlight";
 *
 * const keyword = ref("bar");
 * </script>
 *
 * <template>
 *  <div v-highlight:my-custom-highlight="keyword">
 *  foo bar baz
 * </div>
 * </template>
 * <style>
 * ::highlight(my-custom-highlight) {
 *   background-color: yellow;
 *   color: black;
 * }
 * </style>
 * ```
 *
 * @example **Multiple highlights:** Highlight the keywords "foo" and "baz" in the text "foo bar baz" with multiple highlights.
 *
 * ```vue
 * <script setup>
 * import { ref } from "vue";
 * import vHighlight from "@kamiazya/vue-highlight";
 *
 * const keyword1 = ref("bar");
 * const keyword2 = ref("foo");
 * </script>
 *
 * <template>
 * <div
 *   v-highlight:highlight1="keyword1"
 *   v-highlight:highlight2="keyword2"
 * >
 *  foo bar baz
 * </div>
 * </template>
 * <style>
 * ::highlight(highlight1) {
 *   background-color: yellow;
 *   color: black;
 * }
 * ::highlight(highlight2) {
 *   background-color: red;
 *   color: white;
 * }
 * </style>
 * ```
 */
export const vHighlight: Directive<HTMLElement, Keyword> = Object.freeze({
  mounted: applyHighlight,
  updated: applyHighlight,
  unmounted: removeHighlight,
});

export default vHighlight;
