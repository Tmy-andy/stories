const mongoose = require('mongoose');
require('dotenv').config();
const Story = require('./models/Story');
const Chapter = require('./models/Chapter');
const User = require('./models/User');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

const seedStories = [
  {
    title: "Vô Ảnh Kiếm",
    author: "Phong Nguyệt",
    description: "Một thanh kiếm vô hình, một con đường tu luyện đầy gian nan. Thiếu niên từ vùng thôn quê bước vào giang hồ, gặp gỡ các cao thủ, khám phá bí mật của thanh kiếm thần kỳ.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5WC0JRp6pj8gn_KExnTux5KVKEzncjtinAIncl-bMGyWL6WC8v5bRuXoH6wnOWFGQ_xrlqvfwdAVXqkD94tnTXcxfvzUTgFvPHcrpksN5aaZrCfq-NW1gaWoL0wBbCXmJs5C0jS2xV6P90K25gpjr0LTTmlRNoShd55DNsDColCvqUbJ48YBxaT3WIOMraYajJ_4lduSjsYB7F90DyL6TXA3qeUjNJtVIU6d6U7dDE1oQNoKS4vL8amYISEu2UovnnIaf7Xn50W15",
    category: "Kiếm hiệp",
    status: "Đang ra",
    views: 125000,
    likes: 8500,
    chapterCount: 0,
    featured: true
  },
  {
    title: "Độc Bộ Thiên Hạ",
    author: "Mặc Thủy",
    description: "Trong loạn thế, anh hùng xuất hiện. Một thiên tài võ học với tài năng đặc biệt, bước đi trên con đường chinh phục thiên hạ, đối đầu với các cao thủ muôn đời.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfTC_ors11Lhxc2oShOJSmSB6TlwI7OG6mBWRFOYsUyGZUH8lt48yL8TwQ6izOlEjUE29xvjFENP1pZlfltljdBBMvMOZbL68OwQkLExKWDDnoi6Ovhx8uGFb3fd7BOD-RJ9L3zcyDkHiRFNSpp5UW3aHiL9iI_TqsrHCGky-gcW1wEmcSNpTPTGzPghIdcP94ndMmUVXZs2KDgAOWLzhpM8Yfm5Wql1-Q5zo4haTvHwC7oe_dzmBTqRtB1YQv5UUGdB_EegpPmvD9",
    category: "Huyền huyễn",
    status: "Đang ra",
    views: 98000,
    likes: 7200,
    chapterCount: 0,
    featured: true
  },
  {
    title: "Hồng Trần Luyến",
    author: "Tịch Tịch",
    description: "Câu chuyện tình yêu lãng mạn giữa nữ nhân vật tài ba và nam chính lạnh lùng. Trong hồng trần phức tạp, họ tìm thấy nhau và cùng vượt qua mọi thử thách.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzMZCoofk5RVLtmlQ29gVxZI1FzKEGYKF_iMLG1jRkwoyBpcF65o2p1LxAYHcrIF2smsbsU-IE8UIPMCSe-FsN2GHGXZWhNHFPEKKQRvpDtp7JH5ISfrs0LnpvQFuI3Z6m_lRDLsfJI56xNKCfPzOemyOqbb2RdYuWaEbHTc4oCkP1kSySORfuPT87UFHf3Va1tPfrNkxi-qBQIuTxFOQgoNV7esrHukd597lBoR7NpmOvAaxEWdSTj8rhBptVbFYFmJxqvq6sSWZY",
    category: "Ngôn tình",
    status: "Đang ra",
    views: 156000,
    likes: 12000,
    chapterCount: 0,
    featured: true
  },
  {
    title: "Thanh Gươm Diệt Quỷ",
    author: "Dạ Ưng",
    description: "Trong thế giới đầy rẫy yêu ma, một kiếm sĩ trẻ tuổi quyết tâm tiêu diệt tất cả quỷ dữ để bảo vệ nhân loại. Hành trình đầy máu và nước mắt.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdZm9GKSOgsLqg3ZcdKtctZAsqZWgAPWR12ZcdLtMRFiAfs-0bFqOcENHYeYNZ_E6c6y5VgBsm4lkS0dzgfZ2L7KnrjDZFcsw-G09l8isoiZvXwDIBPj3Q9LDj6ue3gYo2sioYGlIjwP4Ggz_xJTS2yb8zgHmsVgrvb--Ct_DjcufFKqcLFeTU9F03kixP2_QmN5-sC0egwvYVowE6MPW9UBggB9Aye5gyS6cVzLA0pWk00Qm0ZFezRCP2t698dRmeirKDunUVvW9M",
    category: "Linh dị",
    status: "Đang ra",
    views: 189000,
    likes: 15000,
    chapterCount: 0,
    featured: true
  },
  {
    title: "Yêu Em Từ Cái Nhìn Đầu Tiên",
    author: "Nguyệt Hạ",
    description: "Chuyện tình ngọt ngào giữa cô gái ngây thơ và chàng CEO lạnh lùng. Từ cái nhìn đầu tiên, số phận đã an bài cho họ một cuộc tình đầy sóng gió.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3jK2aKRdvGBm8zzvaZ5oWNH5qdqQJ9dlEJXI9YyfqPQlbFhKwUvXrPQniieytjN0gb6ebKkIcQBPRILh9DNInE5EBXpt0MI4R6RqhBOLpLX6WwfW6vAV6veZTkWmh_8hGRP1kn0kosTr6hgDUKQGg6Rs1H70CNc9J9MgN-e6vYaOla0BFyUzlTL-fC_mh9ZETPvHi9Xhr8EtYGHtJiJiFbe85EHRNWpthVw1No9RryAUntauuspP24CpfxBooklzsya-yaA9YSWF4",
    category: "Ngôn tình",
    status: "Đang ra",
    views: 234000,
    likes: 18000,
    chapterCount: 0,
    featured: true
  },
  {
    title: "Ngạo Thế Cửu Trùng Thiên",
    author: "Phong Lăng Thiên Hạ",
    description: "Tu tiên giả từ thấp đến cao, vượt qua chín tầng trời, chiến đấu với thiên địa để giành lấy vị trí tối thượng. Một hành trình tu luyện hoành tráng.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4q1Je36K3ROi0k8z6pU-4mkTutAyWbAN9HuLi32PF_E273qKA7-bNSRaYlKZoSC1GFoVRM5yhRKfIiU6MNQe5i8B7mk159Gm94OC5gt8lcp5pJUuWgXf2Zp8h5J1zhOsoBpglVplhQ5NIdkNFxERtbVKTWDgLRApR1Ju__5nl3Et3Il7mVXtaK_kITdL41TmknSWxhU6KkMX7thfs5_QN2U4rR0fQruMmOfUKtZ_zAbO2B-pUsUOLwQdkBKyfFdRNJofFgYdcZp45",
    category: "Tiên hiệp",
    status: "Đang ra",
    views: 312000,
    likes: 25000,
    chapterCount: 0,
    featured: false
  },
  {
    title: "Linh Vũ Thiên Hạ",
    author: "Đông Tà",
    description: "Trong thời đại linh khí phục hồi, thiếu niên có thể triệu hồi linh thú chiến đấu. Hành trình từ yếu ớt đến mạnh mẽ, từ vô danh đến nổi tiếng thiên hạ.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1t_v_sFe9CbDvkchDEneWMnjRjr3Ujhci8Dh0ayzgp1vX63N4Vmpw_ZljX59cDZr2WM0Di4ifeQs_ZxLfGzB0NGZIesR6lnhbtal0dCuQ-keLWqGUioOhgiETsvEZX6K7qgpCu6ibwDUZ0dfcv_y5ROeNn6j_Smr3AQFjZKxAU62DF0KV8xqa1bDZbIxn3TcrhARDx2UhoY6HzABu-AjZ3abRd_MpHsgyp_nWo61kmFmc4sRjBi_V7B4cE_quVhYqsOKQRtNJSQEr",
    category: "Huyền huyễn",
    status: "Đang ra",
    views: 178000,
    likes: 13500,
    chapterCount: 0,
    featured: false
  },
  {
    title: "Thần Mộ",
    author: "Thần Đạo",
    description: "Bí ẩn về ngôi mộ cổ của các vị thần. Những nhân vật dũng cảm bước vào khám phá, đối mặt với nguy hiểm và cơ hội.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfDsuaxb-WYjcKRLgLSV3ofsw1WyguJx9alI5ia0LP4jpU-YSa93izAVjxoVSDbQ7C2rZkGH8B6UsLvy6JFtfvOmfCMDv3dePG_GQL_PD-vMfEep0-Rnqef_8T0q9Oc_D4RBTaEX6j9K8dQsxQXx-NOe8aA8OcAmzpWoZfdnaQc6XAoTxzt0sKGyJP645g-Y-DBrsAXYpAsyut1__roqy0kdtpC_fgm1v9D1TWRlqScEqBE_9ff6xGlKCyXi2irICuxVMAHvvlVrCa",
    category: "Huyền huyễn",
    status: "Hoàn thành",
    views: 445000,
    likes: 32000,
    chapterCount: 0,
    featured: false
  },
  {
    title: "Phàm Nhân Tu Tiên",
    author: "Vong Ngữ",
    description: "Từ một phàm nhân bình thường, bước lên con đường tu tiên gian khổ. Không có thiên tư, chỉ có sự kiên trì và thông minh.",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJKVp9IeM9OA18qIBuuE7uNmtKgXv4gKpikU2X3qdrw1chLpnvVgW302IwHCRUREwVRnV1rlS06h62iIAaYObfqjKVkfNuX4O76JrpPxzRulRR7l_vKFwXs9uoC6zZQOhYPyxMZ7Z1oUfGKpDZhVCkt82deuLjVKBEB0XbsRkIp_3ICIAMA7ltpB5dYRD8_2Y0K6JkA3LjujchgCV1RUibQSXAVNK8hk_V9tDKDahKr4LD-QWsCfJR088enYFtZQRFoFL7nQz33TVd",
    category: "Tiên hiệp",
    status: "Đang ra",
    views: 567000,
    likes: 42000,
    chapterCount: 0,
    featured: false
  }
];

async function seedDatabase() {
  try {
    // Tìm hoặc tạo user admin
    let adminUser = await User.findOne({ email: 'tmy300803@gmail.com' });
    if (!adminUser) {
      adminUser = await User.create({
        username: 'tmy300803',
        email: 'tmy300803@gmail.com',
        password: 'hashedPassword123',
        role: 'admin'
      });
    }

    // Xóa dữ liệu cũ
    await Story.deleteMany({});
    await Chapter.deleteMany({});
    console.log('Đã xóa dữ liệu cũ');

    // Thêm authorId cho mỗi story
    const storiesWithAuthor = seedStories.map(story => ({
      ...story,
      authorId: adminUser._id
    }));

    // Thêm stories - save individual stories to trigger pre-save hook for slug generation
    const stories = [];
    for (const storyData of storiesWithAuthor) {
      const story = new Story(storyData);
      await story.save();
      stories.push(story);
    }
    console.log(`Đã thêm ${stories.length} truyện`);

    // Thêm chapters mẫu cho mỗi story
    for (let i = 0; i < stories.length; i++) {
      const story = stories[i];
      const chapters = [];
      
      // Tạo 5 chapter đầu cho mỗi truyện
      for (let j = 1; j <= 5; j++) {
        chapters.push({
          storyId: story._id,
          chapterNumber: j,
          title: `Chương ${j}: ${j === 1 ? 'Khởi đầu' : j === 2 ? 'Gặp gỡ' : j === 3 ? 'Thử thách' : j === 4 ? 'Đột phá' : 'Thành tựu'}`,
          content: `Đây là nội dung của chương ${j} trong truyện "${story.title}".\n\nNội dung này chỉ là mẫu demo. Trong thực tế, đây sẽ là nội dung đầy đủ của chương truyện với nhiều đoạn văn, hội thoại giữa các nhân vật, mô tả cảnh vật và diễn biến tình tiết.\n\nCâu chuyện được kể một cách sinh động, lôi cuốn người đọc bằng những tình tiết hấp dẫn, nhân vật được xây dựng kỹ lưỡng và thế giới quan phong phú.\n\nMỗi chương đều có một điểm nhấn riêng, đưa câu chuyện đến những cao trào mới và khiến người đọc mong chờ chương tiếp theo.`,
          views: Math.floor(Math.random() * 10000) + 1000
        });
      }
      
      await Chapter.insertMany(chapters);
      
      // Cập nhật chapterCount
      await Story.findByIdAndUpdate(story._id, { chapterCount: 5 });
    }
    
    console.log('Đã thêm chapters cho tất cả truyện');
    console.log('Seed database hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi seed database:', error);
    process.exit(1);
  }
}

seedDatabase();
