import React from "react";
import { useState } from "react";
import styles from '../css/Sidebar.module.css'
import SidebarElement from './SidebarElement.jsx'
import eyeOpenSvg from '../assets/svg/eye.svg'
import eyeClosedSvg from '../assets/svg/eye-closed.svg'
export default function Sidebar({setView, activeView, onToggle, isCollapsed}){
    return(
        <>
            <aside className={`${styles.sidebar} ${isCollapsed ? styles.sidebarCollapsed : ''}`}>
                <div className={`${styles.toggleOpenContainer}`} onClick={onToggle}>
                    <img src={isCollapsed ? eyeClosedSvg : eyeOpenSvg } className={styles.eyeSvg} alt="Toggle Views" />
                </div>
                <div className={`${styles.sidebarContent} ${isCollapsed ? styles.sidebarContentCollapsed : ''}`}>
                    <h1 className={styles.sidebarTitle}>Monitoring Views</h1>
                    <h2 className={styles.componentName}>CPU</h2>
                    <SidebarElement onClick={()=>setView('CPUGeneralView')} viewName={'CPUGeneralView'} activeView={activeView} text='General View'></SidebarElement>
                    <SidebarElement onClick={()=>setView('CPUCoresView')} viewName={'CPUCoresView'} activeView={activeView} text='View by Cores'></SidebarElement>
                    <h2 className={styles.componentName}>Memory</h2>
                    <SidebarElement onClick={()=>setView('MEMAvailableView')} viewName={'MEMAvailableView'} activeView={activeView} text='View free and used'></SidebarElement>
                    <h2 className={styles.componentName}>Storage</h2>

                </div>
            </aside>
        </>
    )
}