import React from 'react';
import styles from './DynamicSection.module.css';
export default function DynamicSection({ children }) {
  return <section className={styles.dynamicSection}>{children}</section>;
}
