// Shrinks a photo in the browser before it is uploaded.
// Phone cameras produce 3-12 MB images (and iPhones may hand over HEIC), which
// the server and Vercel's 4.5 MB request limit reject. Re-drawing the photo on a
// canvas as a JPEG no wider/taller than `max` px keeps ID text sharp at ~200-600 KB.
// Non-images (PDFs) and images that can't be decoded are returned unchanged.
export async function compressImage(file, { max = 1800, quality = 0.85, skipBelow = 900 * 1024 } = {}) {
  if (!file || !/^image\//i.test(file.type || "") || /gif/i.test(file.type)) return file;
  if (file.size <= skipBelow && /jpe?g|png|webp/i.test(file.type)) return file;

  let bitmap = null;
  let img = null;
  try {
    if (typeof createImageBitmap === "function") {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }).catch(() => createImageBitmap(file));
    }
  } catch { bitmap = null; }

  if (!bitmap) {
    img = await new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const el = new Image();
      el.onload = () => { URL.revokeObjectURL(url); resolve(el); };
      el.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
      el.src = url;
    });
    if (!img) return file;
  }

  const src = bitmap || img;
  const w0 = src.width || src.naturalWidth;
  const h0 = src.height || src.naturalHeight;
  if (!w0 || !h0) return file;
  const scale = Math.min(1, max / Math.max(w0, h0));
  const w = Math.round(w0 * scale);
  const h = Math.round(h0 * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff"; // transparent PNGs become white, not black, as JPEG
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(src, 0, 0, w, h);
  if (bitmap?.close) bitmap.close();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
  if (!blob) return file;
  const name = (file.name || "photo").replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg", lastModified: Date.now() });
}
