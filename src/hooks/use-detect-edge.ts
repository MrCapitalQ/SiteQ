/// <reference types="user-agent-data-types" />

export function useDetectEdge(): boolean {
  const userAgentData = navigator.userAgentData;
  for (const brandVersionPair of userAgentData?.brands ?? []) {
    if (brandVersionPair.brand == "Microsoft Edge") {
      return true;
    }
  }
  return false;
}
