import React, { useState } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';
import stampImage from '../assets/images/stamp-VN.png';

const ContactModal = ({ notification, contact, onClose, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(notification._id);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (!notification || !contact) {
    return null;
  }

  // Render vào document.body thay vì parent component
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container - Centered */}
      <div className="relative flex w-full max-w-2xl flex-col rounded-xl bg-white dark:bg-[#1C182D] shadow-2xl dark:shadow-black/50 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          disabled={isDeleting}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-200/50 dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-300/70 dark:hover:bg-white/20 transition-colors"
          title="Đóng"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="flex flex-col p-8 sm:p-12">
          
          {/* Header */}
          <div className="flex flex-col text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-primary font-display pb-6">Thư Trả Lời từ Lam Điệp Cô Ảnh</h2>
          </div>

          {/* Original Message */}
          <div className="mb-8 pb-8 border-b border-gray-300 dark:border-gray-600">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tin nhắn đã gửi:</h3>
            <p className="text-base text-gray-900 dark:text-white font-medium mb-1">{contact.subject}</p>
            <p className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{contact.message}</p>
          </div>

          {/* Letter Section - Blue Box */}
          <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">            
            {/* Letter Content */}
            <div className="space-y-4 text-gray-800 dark:text-gray-200">
              <p>Thân gửi <span className="font-bold text-primary font-serif">{contact.userId?.displayName || contact.name || contact.email || 'bạn'}</span>,</p>
              <p>Cảm ơn bạn đã chờ đợi phản hồi từ Lam Điệp Cô Ảnh.</p>
              <p className="whitespace-pre-wrap">Chúng tôi đã nhận được yêu cầu của bạn và xin được phản hồi như sau: {contact.replyContent}</p>
              <p>Trân trọng,</p>
            </div>
            
            {/* Signature with Stamp */}
            <div className="relative h-48 mt-4 flex items-center justify-end pr-8">
              {/* Stamp - Nằm dưới */}
              <div className="absolute bottom-0 right-32 opacity-70">
                <img 
                  src={stampImage} 
                  alt="Official Seal" 
                  className="w-32 h-32 object-contain"
                />
              </div>
              
              {/* Signature - Chèn lên stamp */}
              <div className="relative z-10">
                <p className="text-8xl font-signature text-gray-700 dark:text-gray-300 whitespace-nowrap">Andy</p>
              </div>
            </div>
            {contact.repliedAt && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {new Date(contact.repliedAt).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>

          {/* Close Button */}
          <div className="flex pt-8 justify-center">
            <button 
              onClick={handleClose}
              disabled={isDeleting}
              className="flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-6 flex-1 sm:flex-none bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:bg-opacity-90 transition-opacity font-display"
            >
              <span className="truncate">{isDeleting ? 'Đang xóa...' : 'Đóng'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContactModal;
