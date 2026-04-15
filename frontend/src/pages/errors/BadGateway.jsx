import React from 'react';
import { Cloud } from 'lucide-react';
import ErrorPage from './ErrorPage';

const BadGateway = () => (
  <ErrorPage
    code="502"
    title="Kết nối máy chủ không ổn định"
    message={"Máy chủ tạm thời không phản hồi.\nVui lòng kiểm tra lại kết nối hoặc thử tải lại trang."}
    Icon={Cloud}
    accent="text-orange-500 dark:text-orange-400"
  />
);

export default BadGateway;
