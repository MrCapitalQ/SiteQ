/// <reference types="user-agent-data-types" />

export function useDetectPlatform(): { isEdge: boolean, platform?: string } {
  let isEdge = false;
  const userAgentData = navigator.userAgentData;
  for (const brandVersionPair of userAgentData?.brands ?? []) {
    if (brandVersionPair.brand == "Microsoft Edge") {
      isEdge = true;
      break;
    }
  }
  return { isEdge: isEdge, platform: userAgentData?.platform };
}
