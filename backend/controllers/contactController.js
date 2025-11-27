const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'lamdiepcohanh@gmail.com',
    pass: process.env.EMAIL_PASSWORD // App password from Gmail
  }
});

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    // Get userId if logged in
    const userId = req.user ? req.user.id : null;

    // Create contact
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      userId
    });

    await contact.save();

    // Send email notification to admin
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || 'lamdiepcohanh@gmail.com',
        to: 'lamdiepcohanh@gmail.com',
        subject: `[Liên hệ mới] ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #8b5cf6;">Liên hệ mới từ website Lam Điệp Cô Ảnh</h2>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Tên:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Tiêu đề:</strong> ${subject}</p>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 15px 0;">
              <p><strong>Nội dung:</strong></p>
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 12px;">
              Thời gian: ${new Date().toLocaleString('vi-VN')}
            </p>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email notification sent successfully');
    } catch (emailError) {
      console.error('❌ Error sending email:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({ 
      message: 'Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject
      }
    });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

// Get all contacts (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = status ? { status } : {};
    
    const contacts = await Contact.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Update contact status (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }

    res.json({ message: 'Cập nhật thành công', contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Delete contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }

    res.json({ message: 'Xóa liên hệ thành công' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Respond to contact (admin only)
exports.respondToContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    console.log('🔵 respondToContact called with id:', id, 'message:', message?.substring(0, 50));

    if (!message || !message.trim()) {
      console.log('❌ Message is empty');
      return res.status(400).json({ message: 'Vui lòng nhập nội dung trả lời' });
    }

    console.log('🔵 Updating contact in database...');
    const contact = await Contact.findByIdAndUpdate(
      id,
      { 
        replied: true,
        replyContent: message,
        repliedAt: new Date(),
        status: 'replied'
      },
      { new: true }
    );

    if (!contact) {
      console.log('❌ Contact not found with id:', id);
      return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }

    console.log('✅ Contact updated:', {
      id: contact._id,
      replied: contact.replied,
      userId: contact.userId,
      email: contact.email
    });

    // Gửi notification cho user nếu đã đăng nhập
    if (contact.userId) {
      try {
        console.log('🔵 Creating notification for userId:', contact.userId.toString());
        const Notification = require('../models/Notification');
        const io = req.app.locals.io;
        const userConnections = req.app.locals.userConnections;

        console.log('🔵 Socket.io availability:', {
          io: !!io,
          userConnections: !!userConnections,
          connectionsCount: userConnections ? Object.keys(userConnections).length : 0
        });

        const notification = new Notification({
          userId: contact.userId,
          type: 'contact_reply',
          message: `Bạn có một trả lời từ Lam Điệp Cô Ảnh về: "${contact.subject}"`,
          contactId: contact._id
        });

        await notification.save();
        console.log('✅ Notification created for user:', contact.userId.toString());

        // Populate contactId trước khi emit via Socket.io
        const populatedNotification = await Notification.findById(notification._id)
          .populate('contactId', 'name email subject message replyContent repliedAt');

        console.log('✅ Populated notification:', populatedNotification);

        // Gửi qua Socket.io nếu user online
        const userRoom = `user_${contact.userId.toString()}`;
        console.log('🔵 Checking Socket.io connection for room:', userRoom);
        
        if (io && userConnections && userConnections[contact.userId.toString()]) {
          console.log('✅ User is online, sending notification via Socket.io');
          io.to(userRoom).emit('notification', populatedNotification);
          console.log('✅ Real-time notification sent via Socket.io');
        } else {
          console.log('⚠️ User is offline, notification saved to database');
        }
      } catch (notifError) {
        console.error('❌ Error creating notification:', notifError.message);
      }
    } else {
      console.log('⚠️ Contact has no userId - user was not logged in when sending contact');
    }

    res.json({ message: 'Đã gửi trả lời', contact });
  } catch (error) {
    console.error('❌ Error in respondToContact:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Get contact details by ID (user can view their own contact)
exports.getContactDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const contact = await Contact.findById(id).populate('userId', 'username email displayName');

    if (!contact) {
      return res.status(404).json({ message: 'Không tìm thấy liên hệ' });
    }

    // Allow user to view their own contact or admin to view any contact
    const isAdmin = req.user?.role === 'admin';
    if (contact.userId && contact.userId._id.toString() !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Bạn không có quyền xem liên hệ này' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact details:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
