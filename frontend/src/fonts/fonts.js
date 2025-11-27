// Tạo @font-face động từ public folder
const createFontFace = (fontFamily, fontFileName) => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const fontPath = `${publicUrl}/fonts/${fontFileName}`;
  
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: '${fontFamily}';
      src: url('${fontPath}') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  document.head.appendChild(style);
};

// Áp dụng fonts
createFontFace('Bastliga', 'Bastliga Four Regular.otf');
createFontFace('1FTV-VIP-Bastliga-One-Regular', '1FTV-VIP-Bastliga-One-Regular.otf');
createFontFace('SVN-Austin', 'SVN-Austin.otf');

export default {};
