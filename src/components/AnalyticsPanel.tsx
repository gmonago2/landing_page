import React, { useEffect, useState } from 'react';

type EventItem = {
  id: string;
  name: string;
  props: Record<string, any>;
  ts: number;
};

const MAX_EVENTS = 100;

export function AnalyticsPanel(): JSX.Element | null {
  // Only render if Vite DEV flag is present
  // (import.meta.env is replaced at build time by Vite)
  // @ts-ignore
  if (!(import.meta.env && import.meta.env.DEV)) return null;

  const [open, setOpen] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      try {
        // @ts-ignore
        const detail = (e as CustomEvent).detail || {};
        const name = detail.name || 'unknown';
        const props = detail.props || {};
        const item: EventItem = { id: cryptoId(), name, props, ts: Date.now() };
        setEvents((prev) => {
          const next = [item, ...prev];
          return next.slice(0, MAX_EVENTS);
        });
      } catch (err) {
        // ignore
      }
    }

    window.addEventListener('analytics:event', handler as EventListener);
    return () => window.removeEventListener('analytics:event', handler as EventListener);
  }, []);

  function clear() {
    setEvents([]);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-800 text-white text-sm hover:bg-gray-700"
            onClick={() => setOpen((s) => !s)}
          >
            {open ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <button
            className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-500"
            onClick={clear}
          >
            Clear
          </button>
        </div>

        {open && (
          <div className="w-[360px] max-h-[420px] overflow-auto bg-white/95 backdrop-blur rounded shadow-lg p-3 text-xs text-slate-800">
            <div className="mb-2 text-sm font-semibold">Analytics Events (dev)</div>
            {events.length === 0 && <div className="text-gray-500">No events yet.</div>}
            <ul className="space-y-2">
              {events.map((ev) => (
                <li key={ev.id} className="border-b pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="font-medium">{ev.name}</div>
                      <div className="text-[11px] text-gray-600">{new Date(ev.ts).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <pre className="mt-2 text-[11px] text-gray-700 bg-gray-50 p-2 rounded overflow-auto">{JSON.stringify(ev.props, null, 2)}</pre>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function cryptoId() {
  try {
    // @ts-ignore
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  } catch {}
  return Math.random().toString(36).slice(2, 9);
}

export default AnalyticsPanel;
