import React from 'react';
import { useDoc } from '@docusaurus/theme-common/internal';
import DocItemOriginal from '@theme-original/DocItem';

export default function DocItem(props) {
  try {
    const docContext = useDoc();
    if (!docContext || !docContext.doc) {
      return null;
    }
    return <DocItemOriginal {...props} />;
  } catch (e) {
    return null;
  }
}
