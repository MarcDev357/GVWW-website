import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { metaForPath, SITE_URL } from "../data/meta";

function setTag(selector, create, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(create.tag);
    for (const [k, v] of Object.entries(create.attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute(create.valueAttr, value);
}

export default function RouteMeta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const m = metaForPath(pathname);
    const url = SITE_URL + (m.path === "/" ? "/" : m.path);
    document.title = m.title;
    setTag('meta[name="description"]', { tag: "meta", attrs: { name: "description" }, valueAttr: "content" }, m.description);
    setTag('link[rel="canonical"]', { tag: "link", attrs: { rel: "canonical" }, valueAttr: "href" }, url);
    setTag('meta[property="og:title"]', { tag: "meta", attrs: { property: "og:title" }, valueAttr: "content" }, m.title);
    setTag('meta[property="og:description"]', { tag: "meta", attrs: { property: "og:description" }, valueAttr: "content" }, m.description);
    setTag('meta[property="og:url"]', { tag: "meta", attrs: { property: "og:url" }, valueAttr: "content" }, url);
    setTag('meta[name="twitter:title"]', { tag: "meta", attrs: { name: "twitter:title" }, valueAttr: "content" }, m.title);
    setTag('meta[name="twitter:description"]', { tag: "meta", attrs: { name: "twitter:description" }, valueAttr: "content" }, m.description);
    setTag('meta[name="robots"]', { tag: "meta", attrs: { name: "robots" }, valueAttr: "content" }, m.indexable ? "index,follow" : "noindex");
  }, [pathname]);

  return null;
}
