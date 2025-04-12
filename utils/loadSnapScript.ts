// utils/loadSnapScript.ts
export const loadSnapScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject('Window is undefined (server side)');
      if (document.getElementById('snap-script')) return resolve(); // sudah ada
  
      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', 'SB-Mid-client-9mZmh1rqzJnS6zX7'); // ganti client key
      script.id = 'snap-script';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Gagal memuat Snap script'));
      document.body.appendChild(script);
    });
  };
  