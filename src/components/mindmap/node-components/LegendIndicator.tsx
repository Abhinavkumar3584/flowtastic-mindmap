
import { Check } from 'lucide-react';
import { LegendPosition } from '../types';
import { CSSProperties } from 'react';

interface LegendIndicatorProps {
  enabled: boolean;
  position: LegendPosition;
  color: string;
}

export const LegendIndicator = ({ enabled, position, color }: LegendIndicatorProps) => {
  if (!enabled) return null;

  const positionStyle = getLegendPosition(position, color);
  
  return (
    <div style={positionStyle}>
      <Check
        className="h-3 w-3"
        style={{ color }}
      />
    </div>
  );
};

const getLegendPosition = (position: LegendPosition, color: string): CSSProperties => {
  const base: CSSProperties = {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: `2px solid ${color || '#000000'}`,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  };

  switch (position) {
    case 'left-top':
      return { ...base, left: '-10px', top: '-10px' };
    case 'left-center':
      return { ...base, left: '-10px', top: '50%', transform: 'translateY(-50%)' };
    case 'left-bottom':
      return { ...base, left: '-10px', bottom: '-10px' };
    case 'right-top':
      return { ...base, right: '-10px', top: '-10px' };
    case 'right-center':
      return { ...base, right: '-10px', top: '50%', transform: 'translateY(-50%)' };
    case 'right-bottom':
      return { ...base, right: '-10px', bottom: '-10px' };
    default:
      return base;
  }
};
