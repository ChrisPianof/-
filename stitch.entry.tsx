/**
 * Stitch render adapter entry point.
 *
 * Загружается в sandboxed iframe из Stitch app. Слушает postMessage
 * с composition tree → рендерит реальный React с реальным CSS.
 *
 * postMessage protocol:
 *   Stitch → iframe:   { type: 'stitch:render', tree: RenderNode[] }
 *   iframe → Stitch:   { type: 'stitch:ready' }                            // after first render
 *   iframe → Stitch:   { type: 'stitch:navigate', toScreenId: string }     // click on instance с navigation
 *
 * Bundle published как single JS file через vite.stitch.config.ts → gh-pages.
 */

import { createRoot, type Root } from "react-dom/client";
import type { CSSProperties, ReactNode } from "react";
import { ButtonDesktop } from "@alfalab/core-components/button/desktop";
import { InputDesktop } from "@alfalab/core-components/input/desktop";
import { Title } from "@alfalab/core-components/typography/title";
import { Text } from "@alfalab/core-components/typography/text";

import "@alfalab/core-components/themes/corp.css";

type RenderNode = {
  instanceId: string;
  componentId: string;
  props: Record<string, string>;
  children: Record<string, RenderNode[]>;
  navigations?: Record<string, string>;
};

type RenderMessage = { type: "stitch:render"; tree: RenderNode[] };
type Incoming = RenderMessage;

function asNumber(v: string | undefined, fallback: number): number {
  if (!v) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(v: string | undefined, fallback: boolean): boolean {
  if (v === "true") return true;
  if (v === "false") return false;
  return fallback;
}

function emitNavigate(toScreenId: string) {
  window.parent?.postMessage({ type: "stitch:navigate", toScreenId }, "*");
}

const PLATE_STYLES: Record<string, CSSProperties> = {
  Primary: { background: "#ffffff" },
  Secondary: { background: "#f2f3f5" },
  Colored: { background: "#fff5e0" },
  Border: { background: "transparent", border: "1px solid #d8d9da" },
};

const PLATE_LEVEL_RADIUS: Record<string, number> = { "Level 1": 16, "Level 2": 12 };

function StitchBgPlate({
  node,
  children,
  onActivate,
}: {
  node: RenderNode;
  children: ReactNode;
  onActivate?: () => void;
}) {
  const props = node.props;
  const type = props["type"] ?? "Primary";
  const position = props["position"] ?? "Level 1";
  const base = PLATE_STYLES[type] ?? PLATE_STYLES["Primary"]!;
  const radius = PLATE_LEVEL_RADIUS[position] ?? 16;
  return (
    <div
      onClick={onActivate}
      style={{
        ...base,
        borderRadius: radius,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        cursor: onActivate ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

const TITLE_VIEW_MAP = {
  xLarge: { view: "xlarge" },
  large: { view: "large" },
  medium: { view: "medium" },
  small: { view: "small" },
  xsmall: { view: "xsmall" },
} as const;

function StitchTitle({ node, onActivate }: { node: RenderNode; onActivate?: () => void }) {
  const props = node.props;
  const view = (props["view"] ?? "large") as keyof typeof TITLE_VIEW_MAP;
  const heading = props["heading"] ?? "Untitled";
  const subtitle = props["subtitle"];
  const map = TITLE_VIEW_MAP[view] ?? TITLE_VIEW_MAP.large;
  return (
    <div
      onClick={onActivate}
      style={{ display: "flex", flexDirection: "column", gap: 4, cursor: onActivate ? "pointer" : "default" }}
    >
      <Title view={map.view as "xlarge" | "large" | "medium" | "small" | "xsmall"} tag="h1">
        {heading}
      </Title>
      {subtitle ? (
        <Text view="primary-medium" color="secondary">
          {subtitle}
        </Text>
      ) : null}
    </div>
  );
}

function renderNode(node: RenderNode): ReactNode {
  const { componentId, props, children, instanceId, navigations } = node;
  const target = navigations?.["onClick"];
  const onActivate = target ? () => emitNavigate(target) : undefined;

  switch (componentId) {
    case "cmp-button-001": {
      const size = asNumber(props["size"], 56);
      const view = (props["view"] ?? "primary") as
        | "primary"
        | "secondary"
        | "tertiary"
        | "ghost"
        | "text"
        | "link";
      return (
        <ButtonDesktop
          key={instanceId}
          view={view}
          size={size as 32 | 40 | 48 | 56 | 64 | 72}
          onClick={onActivate}
        >
          {props["label"] ?? "Button"}
        </ButtonDesktop>
      );
    }
    case "cmp-input-001": {
      const size = asNumber(props["size"], 56);
      const type = (props["type"] ?? "text") as
        | "text"
        | "number"
        | "email"
        | "password"
        | "tel"
        | "money";
      return (
        <InputDesktop
          key={instanceId}
          label={props["label"] ?? ""}
          placeholder={props["placeholder"] ?? ""}
          size={size as 40 | 48 | 56 | 64}
          type={type}
          block={asBool(props["block"], true)}
          onClick={onActivate}
        />
      );
    }
    case "cmp-titleview-001":
      return <StitchTitle key={instanceId} node={node} onActivate={onActivate} />;
    case "cmp-bgplate-001": {
      const slot = children["children"] ?? [];
      return (
        <StitchBgPlate key={instanceId} node={node} onActivate={onActivate}>
          {slot.map((c) => renderNode(c))}
        </StitchBgPlate>
      );
    }
    default:
      return (
        <div key={instanceId} style={{ padding: 8, border: "1px dashed #999", color: "#666" }}>
          Unknown component: {componentId}
        </div>
      );
  }
}

function ensureMount(): { container: HTMLElement; root: Root } {
  let container = document.getElementById("stitch-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "stitch-root";
    document.body.appendChild(container);
  }
  container.style.padding = "32px";
  container.style.minHeight = "100vh";
  container.style.background = "var(--color-light-base-bg-secondary, #f2f3f5)";

  const ROOT_KEY = "__stitchRoot";
  const existing = (container as HTMLElement & { [k: string]: unknown })[ROOT_KEY] as Root | undefined;
  if (existing) return { container, root: existing };
  const root = createRoot(container);
  (container as HTMLElement & { [k: string]: unknown })[ROOT_KEY] = root;
  return { container, root };
}

function render(tree: RenderNode[]) {
  const { root } = ensureMount();
  root.render(
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 960, margin: "0 auto" }}>
      {tree.length === 0 ? (
        <Text view="primary-medium" color="secondary">
          Empty screen — drop components in Stitch composition editor.
        </Text>
      ) : (
        tree.map((node) => renderNode(node))
      )}
    </div>
  );
}

window.addEventListener("message", (event: MessageEvent<Incoming>) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;
  if (data.type === "stitch:render") {
    render(data.tree);
  }
});

// Initial render — empty state
render([]);

// Tell parent we're ready
window.parent?.postMessage({ type: "stitch:ready" }, "*");
