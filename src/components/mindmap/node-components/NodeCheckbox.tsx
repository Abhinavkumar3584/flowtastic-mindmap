
import { Checkbox } from '@/components/ui/checkbox';

interface NodeCheckboxProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}

export const NodeCheckbox = ({ isChecked, onChange }: NodeCheckboxProps) => {
  return (
    <div className="absolute left-2 top-2">
      <Checkbox 
        checked={isChecked}
        onCheckedChange={onChange}
        className="h-4 w-4 mr-2"
      />
    </div>
  );
};
