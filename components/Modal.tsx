
import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-brand-navy rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg relative border-2 border-brand-gold/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-brand-gold">{title}</h2>
          <button
            onClick={onClose}
            className="text-brand-secondary hover:text-brand-gold transition-colors"
          >
            <X size={28} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
