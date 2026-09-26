import { useEffect, useState } from 'react';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { listen } from '@tauri-apps/api/event';

export default function Titlebar() {
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  const appWindow = isTauri ? getCurrentWindow() : null;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleFullscreen = async () => {
    if (!appWindow) return;
    const fullscreen = await appWindow.isFullscreen();
    const maximized = await appWindow.isMaximized();

    if (!fullscreen && maximized) {
      await appWindow.unmaximize();
      setTimeout(() => appWindow.setFullscreen(true), 50);
    } else {
      appWindow.setFullscreen(!fullscreen);
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        if (!appWindow) return;
        setIsFullscreen(await appWindow.isFullscreen());
        setIsMaximized(await appWindow.isMaximized());

        await listen('tauri://fullscreen', () => setIsFullscreen(true));
        await listen('tauri://enter-fullscreen', () => setIsFullscreen(true));
        await listen('tauri://exit-fullscreen', () => setIsFullscreen(false));

        await listen('tauri://maximize', () => setIsMaximized(true));
        await listen('tauri://unmaximize', () => setIsMaximized(false));
        await listen('tauri://minimize', () => console.log('Window minimized'));

        await listen('tauri://resize', async () => {
          const max = await appWindow.isMaximized();
          setIsMaximized(max);
        });
      } catch (err) {
        console.warn('Tauri titlebar events not available in browser mode', err);
      }
    };

    setup();

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, []);

  return (
    <div data-tauri-drag-region className="titlebar ml-auto">
      {!isFullscreen && (
        <>
          <button
            onClick={() => appWindow?.minimize()}
            className="titlebar-button z-9999"
            id="titlebar-minimize"
          >
            <img src="https://api.iconify.design/mdi:window-minimize.svg" alt="minimize" />
          </button>

          <button
            onClick={async () => {
              if (!appWindow) return;
              await appWindow.toggleMaximize();
              const max = await appWindow.isMaximized();
              setIsMaximized(max);
            }}
            className="titlebar-button z-9999"
            id="titlebar-maximize"
          >
            {!isMaximized ? (
              <img src="https://api.iconify.design/mdi:window-maximize.svg" alt="maximize" />
            ) : (
              <img src="https://api.iconify.design/mdi:window-restore.svg" alt="restore" />
            )}
          </button>

          <button
            onClick={() => appWindow?.close()}
            className="titlebar-button z-9999"
            id="titlebar-close"
          >
            <img src="https://api.iconify.design/mdi:close.svg" alt="close" />
          </button>
        </>
      )}
    </div>
  );
}
