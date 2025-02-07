
import { Select, SelectProps } from '@mantine/core';
import { FC } from 'react';

export interface ThemedSelectProps extends Omit<SelectProps, 'styles'> {
  label?: string;
}

const ThemedSelect: FC<ThemedSelectProps> = ({ label, className, ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium mb-1.5 block text-foreground dark:text-gray-100">
          {label}
        </label>
      )}
      <Select
        {...props}
        comboboxProps={{ 
          position: 'bottom',
          withinPortal: false,
          zIndex: 9999
        }}
      />
    </div>
  );
};

export default ThemedSelect;

