/// <reference types="user-agent-data-types" />

type DetectBrowserResult = { isEdge: boolean, isChrome: boolean };

export function useDetectBrowser(): DetectBrowserResult {
  const result = {
    isEdge: false,
    isChrome: false
  };

  const userAgentData = navigator.userAgentData;
  for (const brandVersionPair of userAgentData?.brands ?? []) {
    if (brandVersionPair.brand === "Microsoft Edge") {
      result.isEdge = true;
    } else if (brandVersionPair.brand === "Google Chrome") {
      result.isChrome = true;
    }
  }
  return result;
}
