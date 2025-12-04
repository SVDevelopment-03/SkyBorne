import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function Modal({ isOpen, onClose, title, message, buttonText = 'Done' }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative"
            >
              <button
                onClick={onClose}
                type='button'
                className="absolute top-4 right-4 text-[#737373] hover:text-[#262626] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="space-y-4">
                <h3 className="text-[#262626]">
                  {title}
                </h3>
                <p className="text-[#737373]">
                  {message}
                </p>
                <button
                type='button'
                  onClick={onClose}
                  className="w-full bg-[linear-gradient(270deg,_#FBEFD8_-21.76%,_#B95E82_100%)] text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {buttonText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
