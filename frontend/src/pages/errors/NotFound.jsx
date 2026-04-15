import React from 'react';
import { SearchX } from 'lucide-react';
import ErrorPage from './ErrorPage';

const NotFound = () => (
  <ErrorPage
    code="404"
    title="Không tìm thấy trang"
    message={"Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.\nHãy kiểm tra lại đường dẫn hoặc quay về trang chủ."}
    Icon={SearchX}
  />
);

export default NotFound;
