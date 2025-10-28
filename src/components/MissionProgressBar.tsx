import React from 'react';

interface Props {
  completed: number;
  total: number;
  height?: number;
}

export function MissionProgressBar({ completed, total, height = 12 }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const barStyle: React.CSSProperties = {
    width: '100%',
    background: '#e6e6e6',
    borderRadius: height / 2,
    height,
    overflow: 'hidden',
  };
  const fillStyle: React.CSSProperties = {
    width: `${Math.min(Math.max(pct, 0), 100)}%`,
    height: '100%',
    background: 'linear-gradient(90deg,#60a5fa,#2563eb)',
    transition: 'width 300ms ease',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <div>Progress</div>
        <div>{pct}% ({completed}/{total})</div>
      </div>
      <div style={barStyle} aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} role="progressbar">
        <div style={fillStyle} />
      </div>
    </div>
  );
}

export default MissionProgressBar;
