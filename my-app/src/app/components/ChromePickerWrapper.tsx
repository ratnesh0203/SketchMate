import React from 'react';
import { ChromePicker, ColorResult } from 'react-color';

interface ChromePickerWrapperProps {
  color?: string;
  onChange?: (color: ColorResult) => void;
}

const ChromePickerWrapper: React.FC<ChromePickerWrapperProps> = ({
  color = '#000',
  onChange = () => {},
}) => {
  return <ChromePicker color={color} onChange={onChange} />;
};

export default ChromePickerWrapper;
