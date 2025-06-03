'use client';

import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

import LoginView from '../views/login/login-view';

const LoginModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-1">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FiX className="w-6 h-6" />
        </button>
        
        {/* Konten login */}
        <div className="p-8">
          <LoginView />
        </div>
      </div>
    </div>
  );
};

export default LoginModal;