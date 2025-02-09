
interface NodeLabelProps {
  label: string;
  fontSize: number;
  fontFamily?: string;
  isEditing: boolean;
  onLabelChange: (newLabel: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const NodeLabel = ({
  label,
  fontSize,
  fontFamily
}: NodeLabelProps) => {
  return (
    <div 
      className="w-full p-2 whitespace-pre-wrap break-words leading-normal font-semibold"
      style={{ 
        fontSize: `${fontSize}px`,
        fontFamily
      }}
    >
      {label}
    </div>
  );
};
