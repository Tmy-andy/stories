import React, { useState, useEffect } from 'react';
import { managerAPI } from '../../services/managerAPI';
import { Mail, Trash2, Eye, AlertCircle, Loader, Check } from 'lucide-react';
import ManagerLayout from '../../components/manager/ManagerLayout';

const ManagerContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    loadContacts();
  }, [filterStatus, searchTerm]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const response = await managerAPI.getContacts({
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchTerm || undefined,
      });

      setContacts(response.data.contacts);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách liên hệ');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await managerAPI.markContactAsRead(id);
      setContacts(contacts.map(contact =>
        contact._id === id ? { ...contact, isRead: true } : contact
      ));
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi cập nhật');
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      alert('Vui lòng nhập nội dung trả lời');
      return;
    }

    try {
      setReplying(true);
      const response = await managerAPI.respondToContact(id, { message: replyText });
      
      // Cập nhật contact với dữ liệu từ backend
      setContacts(contacts.map(contact =>
        contact._id === id ? { 
          ...contact, 
          replied: true,
          replyContent: replyText,
          repliedAt: new Date()
        } : contact
      ));
      
      // Cập nhật selectedContact để hiển thị modal đúng
      setSelectedContact(prev => prev ? {
        ...prev,
        replied: true,
        replyContent: replyText,
        repliedAt: new Date()
      } : null);
      
      setReplyText('');
      alert('Đã gửi trả lời');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi gửi trả lời');
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) return;

    try {
      await managerAPI.deleteContact(id);
      setContacts(contacts.filter(contact => contact._id !== id));
      alert('Xóa liên hệ thành công');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi xóa liên hệ');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      new: { label: 'Mới', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      read: { label: 'Đã xem', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
      replied: { label: 'Đã trả lời', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    };
    const statusInfo = statusMap[status] || statusMap.new;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <ManagerLayout>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-[#2A2640] rounded w-1/4 animate-pulse" />
          <div className="h-96 bg-gray-200 dark:bg-[#2A2640] rounded animate-pulse" />
        </div>
      </ManagerLayout>
    );
  }

  return (
    <ManagerLayout>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-gray-900 dark:text-white text-3xl font-bold">Quản lý liên hệ</h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">Xem và phản hồi các yêu cầu từ người dùng</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative sm:col-span-2 lg:col-span-3">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-4 pr-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Filter by status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-4 bg-gray-50 dark:bg-[#2A2640] border border-gray-300 dark:border-[#3c3858] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-primary focus:border-primary"
          >
            <option value="all">Tất cả</option>
            <option value="new">Mới</option>
            <option value="read">Đã xem</option>
            <option value="replied">Đã trả lời</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1C182F] rounded-xl border border-gray-200 dark:border-[#2A2640] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-[#2A2640]">
              <tr>
                <th className="px-6 py-3">Người gửi</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Chủ đề</th>
                <th className="px-6 py-3">Ngày gửi</th>
                <th className="px-6 py-3">Trạng thái</th>
                <th className="px-6 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact._id} className="bg-white dark:bg-[#1C182F] border-b dark:border-[#2A2640] hover:bg-gray-50 dark:hover:bg-[#2A2640]/50">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {contact.userId?.username}
                    </td>
                    <td className="px-6 py-4 text-xs">{contact.email}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{contact.subject}</td>
                    <td className="px-6 py-4 text-xs">
                      {new Date(contact.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(contact.replied ? 'replied' : contact.isRead ? 'read' : 'new')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowModal(true);
                            if (!contact.isRead) {
                              handleMarkAsRead(contact._id);
                            }
                          }}
                          title="Xem chi tiết"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact._id)}
                          title="Xóa"
                          className="p-1 hover:bg-gray-100 dark:hover:bg-[#2A2640] rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    Không tìm thấy liên hệ nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#1C182F] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-[#2A2640] bg-white dark:bg-[#1C182F]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chi tiết liên hệ</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedContact(null);
                  setReplyText('');
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tên người gửi: </label>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedContact.userId?.displayName || selectedContact.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email: </label>
                <a
                  href={`mailto:${selectedContact.email}`}
                  className="mt-1 text-primary hover:underline"
                >
                  {selectedContact.email}
                </a>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chủ đề</label>
                <p className="mt-1 text-gray-900 dark:text-white">{selectedContact.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung</label>
                <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              {selectedContact.replied ? (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-lg border border-blue-200 dark:border-blue-800 space-y-4">
                  <div className="text-center pb-4 border-b border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-primary">Thư Trả Lời từ Lam Điệp Cô Ảnh</h3>
                  </div>
                  
                  <div className="space-y-4 text-gray-800 dark:text-gray-200">
                    <p>Thân gửi {selectedContact.userId?.displayName || selectedContact.name},</p>
                    <p>Cảm ơn bạn đã chờ đợi phản hồi từ Lam Điệp Cô Ảnh.</p>
                    <p className="whitespace-pre-wrap">Chúng tôi đã nhận được yêu cầu của bạn và xin được phản hồi như sau: {selectedContact.replyContent}</p>
                    <p>Trân trọng,</p>
                  </div>
                  
                  <div className="relative h-48 mt-4 flex items-center justify-end pr-8">
                    {/* Dấu mộc thư nằm dưới */}
                    <div className="absolute bottom-0 right-32 opacity-70">
                      <img 
                        src={require('../../assets/images/stamp-VN.png')} 
                        alt="Official Seal" 
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                    
                    {/* Chữ ký nằm chèn lên stamp */}
                    <div className="relative z-10">
                      <p className="text-8xl font-signature text-gray-700 dark:text-gray-300 whitespace-nowrap">Andy</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-blue-600 dark:text-blue-400 text-center pt-2">✓ Đã gửi trả lời</p>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-[#2A2640]">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung trả lời..."
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-[#2A2640] bg-gray-50 dark:bg-[#2A2840] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-primary focus:border-primary"
                  />

                  <button
                    onClick={() => handleReply(selectedContact._id)}
                    disabled={replying || !replyText.trim()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {replying ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Gửi trả lời
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};

export default ManagerContacts;
