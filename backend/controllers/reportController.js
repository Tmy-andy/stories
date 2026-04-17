const Report = require('../models/Report');
const Comment = require('../models/Comment');

const REASON_LABELS = {
  inappropriate: 'Nội dung không phù hợp',
  copyright: 'Vi phạm bản quyền',
  unwanted: 'Tôi không muốn nhìn thấy nội dung này'
};

// POST /api/reports — Gửi báo cáo
exports.createReport = async (req, res) => {
  try {
    const { commentId, replyId, reason, detail } = req.body;
    const reportedBy = req.user.id;

    if (!commentId || !reason) {
      return res.status(400).json({ message: 'commentId và reason là bắt buộc' });
    }

    if (!REASON_LABELS[reason]) {
      return res.status(400).json({ message: 'Lý do không hợp lệ' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Bình luận không tồn tại' });
    }

    const report = await Report.create({
      commentId,
      replyId: replyId || null,
      reportedBy,
      reason,
      detail: detail?.trim() || ''
    });

    res.status(201).json({ message: 'Báo cáo đã được gửi', report });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Bạn đã báo cáo bình luận này rồi' });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports — Lấy danh sách báo cáo (manager/admin)
exports.getReports = async (req, res) => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = status !== 'all' ? { status } : {};

    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('reportedBy', 'username displayName avatar')
        .populate('commentId', 'content userId storyId')
        .populate('reviewedBy', 'username displayName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(filter)
    ]);

    res.json({ reports, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/reports/:id — Cập nhật trạng thái (manager/admin)
exports.updateReport = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['reviewed', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
        deleteAt: Report.getDeleteAt()  // tự xóa sau 7 ngày
      },
      { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Báo cáo không tồn tại' });

    res.json({ message: 'Cập nhật thành công', report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/reports/stats — Thống kê
exports.getStats = async (req, res) => {
  try {
    const [pending, reviewed, dismissed] = await Promise.all([
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'reviewed' }),
      Report.countDocuments({ status: 'dismissed' })
    ]);
    res.json({ pending, reviewed, dismissed, total: pending + reviewed + dismissed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
