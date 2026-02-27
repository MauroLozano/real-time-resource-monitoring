import React from 'react';
import styles from './SidebarElement.module.css';
export default function SidebarElement({
  text,
  viewName,
  activeView,
  onClick,
}) {
  const sideBarStyle = activeView == viewName ? styles.active : '';
  return (
    <button
      onClick={onClick}
      className={`${styles.sidebarElement} ${sideBarStyle}`}
    >
      {text}
    </button>
  );
}
