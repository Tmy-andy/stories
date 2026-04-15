import React from 'react';
import { Wrench } from 'lucide-react';
import ErrorPage from './ErrorPage';

const ServiceUnavailable = () => (
  <ErrorPage
    code="503"
    title="Dịch vụ tạm ngưng"
    message={"Hệ thống đang bảo trì hoặc tạm thời quá tải.\nVui lòng quay lại sau ít phút."}
    Icon={Wrench}
    accent="text-amber-500 dark:text-amber-400"
  />
);

export default ServiceUnavailable;
