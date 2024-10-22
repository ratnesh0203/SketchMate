import React from 'react';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  inviteLink: string;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose, children,inviteLink }) => {
  if (!isVisible) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copied to clipboard!');
  };

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-80">
        {children}
        <div className="mt-4 flex justify-between">
          <button onClick={copyToClipboard} className="px-4 py-2 bg-blue-500 text-white rounded">
            Copy Link
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-red-500 text-white rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
