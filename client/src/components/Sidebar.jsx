import React from "react";
import { useState } from "react";
import styles from '../css/Sidebar.module.css'
import SidebarElement from './SidebarElement.jsx'
export default function Sidebar({setView, activeView}){
    return(
        <aside className={`${styles.sidebar}`}>
            <h1>Monitoring Views</h1>
            <h2>CPU</h2>
            <SidebarElement onClick={()=>setView('CPUGeneralView')} viewName={'CPUGeneralView'} activeView={activeView} text='General View'></SidebarElement>
            <SidebarElement onClick={()=>setView('CPUCoresView')} viewName={'CPUCoresView'} activeView={activeView} text='View by Cores'></SidebarElement>
            <h2>Memory</h2>
            <SidebarElement onClick={()=>setView('MEMAvailableView')} viewName={'MEMAvailableView'} activeView={activeView} text='View free and used'></SidebarElement>
            <h2>Storage</h2>
        </aside>
    )
}