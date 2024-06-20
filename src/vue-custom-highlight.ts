import type { Directive, DirectiveHook } from "vue";

export type Keyword = string | string[];

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

/**
 * Escape special characters in a regular expression.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 * @param string -
 * @returns
 */
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

const DEFAULT_HIGHLIGHT_NAME = "vue-custom-highlight";

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
 * Custom highlight directive.
 *
 * @example **Basic usage:** Highlight the keyword "bar" in the text "foo bar baz".
 *
 * ```vue
 * <script setup>
 * import { ref } from "vue";
 * import vCustomHighlight from "@kamiazya/vue-custom-highlight";
 *
 * const keyword = ref("bar");
 * </script>
 *
 * <template>
 *   <div v-custom-highlight="keyword">
 *     foo bar baz
 *   </div>
 * </template>
 * <style>
 * ::highlight {
 *   background-color: yellow;
 *   color: black;
 * }
 * ```
 *
 * @example **Multiple keywords:** Highlight the keywords "foo" and "baz" in the text "foo bar baz".
 *
 * ```vue
 * <script setup>
 *
 * import { ref } from "vue";
 * import vCustomHighlight from "@kamiazya/vue-custom-highlight";
 *
 * const keyword = ref(["foo", "baz"]);
 * </script>
 *
 * <template>
 *  <div v-custom-highlight="keyword">
 *   foo bar baz
 * </div>
 * </template>
 * ```
 *
 * @example **Custom highlight name:** Highlight the keyword "bar" in the text "foo bar baz" with a custom highlight name.
 *
 * ```vue
 * <script setup>
 * import { ref } from "vue";
 * import vCustomHighlight from "@kamiazya/vue-custom-highlight";
 *
 * const keyword = ref("bar");
 * </script>
 *
 * <template>
 *  <div v-custom-highlight:custom="keyword">
 *  foo bar baz
 * </div>
 * </template>
 * <style>
 * ::highlight(custom) {
 *   background-color: yellow;
 *   color: black;
 * }
 * ```
 */
export const vCustomHighlight: Directive<HTMLElement, Keyword> = Object.freeze({
  mounted: applyHighlight,
  updated: applyHighlight,
  unmounted: removeHighlight,
});

export default vCustomHighlight;
