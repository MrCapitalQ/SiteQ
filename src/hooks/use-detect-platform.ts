/// <reference types="user-agent-data-types" />

export function useDetectPlatform(): string {
  if (navigator.userAgentData) {
    return navigator.userAgentData.platform || 'Unknown';
  } else if (navigator.userAgent) {
    const userAgent = navigator.userAgent.toLowerCase();

    if (userAgent.includes('win')) return 'Windows';
    if (userAgent.includes('mac')) return 'macOS';
    if (userAgent.includes('linux')) return 'Linux';
    if (/android/.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';

    return 'Unknown';
  }

  return 'Unknown';
}
