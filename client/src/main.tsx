import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

async function loadPoppinsForPDF() {
  try {
    const loadFont = async (pathOrUrl: string) => {
      const res = await fetch(pathOrUrl, { mode: 'cors' });
      if (!res.ok) throw new Error('fetch failed');
      const arrayBuffer = await res.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    };

    // Regular
    try {
      // Local first
      // @ts-ignore
      (window as any).__POPPINS_TTF__ = await loadFont('/assets/Poppins-Regular.ttf');
    } catch {
      // CDN fallback (Google-hosted Poppins Regular may change version; using a common URL)
      // @ts-ignore
      (window as any).__POPPINS_TTF__ = await loadFont('https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfedw.ttf');
    }

    // Bold/SemiBold (optional)
    try {
      // @ts-ignore
      (window as any).__POPPINS_BOLD_TTF__ = await loadFont('/assets/Poppins-SemiBold.ttf');
    } catch {
      try {
        // @ts-ignore
        (window as any).__POPPINS_BOLD_TTF__ = await loadFont('https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z11lEA.ttf');
      } catch {}
    }
  } catch {}
}

loadPoppinsForPDF().finally(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
