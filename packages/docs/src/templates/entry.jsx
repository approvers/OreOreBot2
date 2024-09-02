import { Layout } from '../organisms/layout';
import React from 'react';

import './theme.css';

export default function Entry({
  children,
  pageContext
}) {
  return (
    <Layout pageContext={pageContext}>{children}</Layout>
  );
}
