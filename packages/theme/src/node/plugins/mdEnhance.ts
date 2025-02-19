import type { Plugin } from "vuepress/core";
import type { MarkdownEnhancePluginOptions } from "vuepress-plugin-md-enhance";
import { mdEnhancePlugin } from "vuepress-plugin-md-enhance";

/**
 * @private
 *
 * Resolve options for vuepress-plugin-md-enhance
 */
export const getMdEnhancePlugin = (
  options?: Partial<MarkdownEnhancePluginOptions> | false,
  legacy = false,
): Plugin | null => {
  if (options === false) return null;

  return mdEnhancePlugin(
    {
      hint: true,
      ...(options || {}),
    },
    legacy,
  );
};
