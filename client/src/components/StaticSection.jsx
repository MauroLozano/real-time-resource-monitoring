import React from "react";
import styles from '../css/StaticSection.module.css'
import LoadingModal from './LoadingModal'
import {EyeClosedIcon, EyeOpenIcon, BrainIcon, ProcessorIcon, SdCardIcon} from './Icons.jsx'
function StaticSection({staticData, onToggle, isCollapsed}){
    if(!staticData){
        return (
            <section className={styles.staticSection}>
                <LoadingModal color='#cbf3f0'></LoadingModal>
            </section>
        )
    }
    return (
        <section className={styles.staticSection}>
            <div className={`${styles.toggleOpenContainer}`} onClick={onToggle}>
                {
                    isCollapsed?
                        <EyeClosedIcon></EyeClosedIcon>
                    :
                        <EyeOpenIcon></EyeOpenIcon>
                }
            </div>
            <h1 className={styles.sectionTitle}>System Components</h1>
            <div className={styles.componentTitleContainer}>
                <ProcessorIcon></ProcessorIcon>
                <h2 className={styles.componentTitle}>CPU</h2>
            </div>
            <p><span className={styles.attributeName}>Brand:</span> {staticData.cpu.brand}</p>
            <p><span className={styles.attributeName}>Manufacturer:</span> {staticData.cpu.manufacturer}</p>
            <p><span className={styles.attributeName}>Amount of cores:</span> {staticData.cpu.cores}</p>
            <div className={styles.componentTitleContainer}>
                <BrainIcon></BrainIcon>
                <h2 className={styles.componentTitle}>Memory</h2>
            </div>
            <p><span className={styles.attributeName}>Total:</span> {staticData.memory.total} GB</p>
            <div className={styles.componentTitleContainer}>
                <SdCardIcon></SdCardIcon>
                <h2 className={styles.componentTitle}>Storage</h2>
            </div>
            {
                staticData.storage.map((disk, index) =>(
                    <div key={index} className={styles.componentSeparator}>
                        <p><span className={styles.attributeName}>Name:</span> {disk.name}</p>
                        <p><span className={styles.attributeName}>Type:</span> {disk.type}</p>
                        <p><span className={styles.attributeName}>Size:</span> {disk.size} GB</p>
                    </div>
                ))
            }
            <div className={styles.componentTitleContainer}>
                <SdCardIcon></SdCardIcon>
                <h2 className={styles.componentTitle}>Operative System</h2>
            </div>
                <p><span className={styles.attributeName}>Platform:</span> {staticData.os.platform}</p>
                <p><span className={styles.attributeName}>Hostname:</span> {staticData.os.hostname}</p>
                <p><span className={styles.attributeName}>Architecture:</span> {staticData.os.architecture}</p>
                <p><span className={styles.attributeName}>{staticData.os.platform == 'linux' ? 'Kernel V.' : staticData.os.platform == 'win32'? 'Build V.:' : 'Release:'}</span> {staticData.os.release}</p>
                <p><span className={styles.attributeName}>Type:</span> {staticData.os.type}</p>

        </section>
    )
}
export default StaticSection