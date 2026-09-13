export function getDeviceId(): string {
  const DEVICE_ID_KEY = 'attendanceDeviceId';
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  
  if (!deviceId) {
    // Generate a simple UUID (crypto.randomUUID is supported in modern browsers)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      // Fallback
      deviceId = 'device-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  
  return deviceId;
}
