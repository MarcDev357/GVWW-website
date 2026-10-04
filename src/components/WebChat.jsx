import { useEffect } from "react";
import { WEBCHAT_WIDGET_ID } from "../data/business";

const SDK_URL = "https://cdn.apigateway.co/webchat-client..prod/sdk.js";
const CONTAINER_ID = "embedded-widget-container";

export default function WebChat() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = SDK_URL;
    script.defer = true;
    script.setAttribute("data-widget-id", WEBCHAT_WIDGET_ID);
    script.setAttribute("data-embed-mode", "embedded");
    script.setAttribute("data-embed-target", CONTAINER_ID);
    document.body.appendChild(script);
    const container = document.getElementById(CONTAINER_ID);
    return () => {
      script.remove();
      if (container) container.replaceChildren();
      // The SDK refuses to initialise twice per page load; clear its lock so the chat returns after in-app navigation.
      globalThis[Symbol.for(`__webchat_init__:${WEBCHAT_WIDGET_ID}|embedded`)] = undefined;
    };
  }, []);

  return <div id={CONTAINER_ID} className="h-[600px] w-full" />;
}
