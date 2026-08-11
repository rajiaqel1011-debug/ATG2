export const MEDIA_V = "20260728";

/** يُلحق بصمة النسخة بمسار أصل (يتخطي روابط data: والروابط المطلقة) */
export const v = (path: string) => {
  if (!path) return path;
  if (
    path.startsWith("data:") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("//")
  ) {
    return path;
  }
  return `${path}?v=${MEDIA_V}`;
};
