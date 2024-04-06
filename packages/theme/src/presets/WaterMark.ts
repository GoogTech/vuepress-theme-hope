/* eslint-disable vue/no-unused-properties */
import { entries, fromEntries, keys } from "@vuepress/helper/client";
import { useMutationObserver } from "@vueuse/core";
import type { VNode } from "vue";
import { defineComponent, h, ref } from "vue";

import "./water-mark.scss";

export default defineComponent({
  name: "WaterMark",

  props: {
    /**
     * Watermark content
     */
    content: { type: String, required: true },

    /**
     * Watermark opacity
     */
    opacity: { type: Number, default: 0.1 },

    /**
     * Watermark font size
     */
    size: { type: String, default: "16px" },

    /**
     * Watermark rotation
     */
    rotation: { type: Number, default: -22.5 },

    /**
     * Watermark font weight
     */
    weight: { type: Number, default: 200 },

    /**
     * Watermark font color
     */
    color: { type: String, default: "#888" },

    /**
     * Watermark font family
     */
    family: { type: String, default: "sans-serif" },

    /**
     * Watermark z index
     */
    zIndex: { type: Number, default: 9999 },
  },

  setup(props, { slots }) {
    const watermark = ref<HTMLElement>();

    useMutationObserver(
      watermark,
      (mutations) => {
        // When the style of the watermark changes, reload the page
        if (
          mutations.every(
            ({ type, attributeName }) =>
              type === "attributes" &&
              keys(props).some((key) => `data-${key}` === attributeName)
          )
        )
          window.location.reload();
      },
      { attributes: true }
    );

    return (): VNode =>
      h(
        "div",
        {
          class: "vp-watermark-wrapper",
          ref: watermark,
          ...fromEntries(
            entries(props).map(([key, value]) => [`data-${key}`, value])
          ),
        },
        [h("div", { class: "vp-watermark" }), slots["default"]?.()]
      );
  },
});
