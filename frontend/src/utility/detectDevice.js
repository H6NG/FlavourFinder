



export function detectDeviceType() {

  const ua = navigator.userAgent;

  if (/iphone/i.test(ua)) return "iphone";
  if (/ipad/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))
    return "ipad";
  if (/android/i.test(ua) && /mobile/i.test(ua)) return "android-phone";
  if (/android/i.test(ua)) return "android-tablet";

  return "desktop";

}