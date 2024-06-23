import type { Directive, DirectiveHook } from "vue";
import { escapeRegExp } from "./utils/escapeRegExp.js";

export type Keyword = undefined | string | string[];

const DEFAULT_HIGHLIGHT_NAME = "v-highlight";

function* walkTextNodes(element: HTMLElement): Generator<Text> {
  const treeWalker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let currentNode: Node | null;
  while ((currentNode = treeWalker.nextNode()) !== null) {
    yield currentNode as Text;
  }
}

function* getMatchRanges(element: HTMLElement, keyword: string | string[]) {
  const matchers = (Array.isArray(keyword) ? keyword : [keyword])
    .filter((v) => v !== "")
    .map((keyword) => new RegExp(escapeRegExp(keyword), "g"));
  for (const text of walkTextNodes(element)) {
    for (const matcher of matchers) {
      let match: RegExpExecArray | null;
      while (
        text.textContent &&
        (match = matcher.exec(text.textContent)) !== null
      ) {
        const range = new Range();
        range.setStart(text, match.index);
        range.setEnd(text, match.index + match[0].length);
        yield range;
      }
    }
  }
}

const applyHighlight: DirectiveHook<HTMLElement, any, Keyword> = (
  element,
  { arg: name = DEFAULT_HIGHLIGHT_NAME, value: keyword = [] },
) => {
  CSS.highlights.delete(name);
  const highlight = new Highlight(...getMatchRanges(element, keyword));
  if (highlight.size >= 0) {
    CSS.highlights.set(name, highlight);
  }
};

const removeHighlight: DirectiveHook<any, any, Keyword> = (
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
export const vHighlight: Directive<any, Keyword> = Object.freeze({
  mounted: applyHighlight,
  updated: applyHighlight,
  unmounted: removeHighlight,
});
