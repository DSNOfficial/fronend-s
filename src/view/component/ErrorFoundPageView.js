

import React from 'react';
import { Button, Result } from 'antd';
const ErrorFoundPageView = () => (
  <Result
    status="404"
    title="404"
    subTitle="សូមអភ័យទោស ទំព័រដែលអ្នកបានចូលមើលមិនមានទេ."
    // extra={<Button type="primary">Back Home</Button>}
  />
);
export default ErrorFoundPageView;