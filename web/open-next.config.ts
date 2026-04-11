import type { OpenNextConfig } from "@opennextjs/cloudflare";

// incrementalCache/tagCache/queue set to "dummy" because Cloudflare Workers
// do not support ISR natively via OpenNext. All pages are dynamically rendered.
// Any `revalidate` values in fetch calls are effectively no-ops in this setup.
const config: OpenNextConfig = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
  edgeExternals: ["node:crypto"],
  middleware: {
    external: true,
    override: {
      wrapper: "cloudflare-edge",
      converter: "edge",
      proxyExternalRequest: "fetch",
      incrementalCache: "dummy",
      tagCache: "dummy",
      queue: "dummy",
    },
  },
};

export default config;
