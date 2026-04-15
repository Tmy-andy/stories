import React from 'react';
import { ServerCrash } from 'lucide-react';
import ErrorPage from './ErrorPage';

const ServerError = () => (
  <ErrorPage
    code="500"
    title="Lỗi máy chủ"
    message={"Đã có lỗi xảy ra ở phía máy chủ. Chúng tôi đang khắc phục sự cố.\nVui lòng thử lại sau ít phút."}
    Icon={ServerCrash}
    accent="text-red-500 dark:text-red-400"
  />
);

export default ServerError;
