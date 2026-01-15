import React from "react";
import styles from '../css/StaticSection.module.css'
import LoadingModal from './LoadingModal'
import eyeOpenSvg from '../assets/svg/eye.svg'
import eyeClosedSvg from '../assets/svg/eye-closed.svg'
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
                <img src={isCollapsed ? eyeClosedSvg : eyeOpenSvg } className={styles.eyeSvg} alt="Toggle Views" />
            </div>
            <h1 className={styles.sectionTitle}>System Components</h1>
            <h2 className={styles.componentName}>CPU</h2>
            <p><span className={styles.attributeName}>Brand:</span> {staticData.cpu.brand}</p>
            <p><span className={styles.attributeName}>Manufacturer:</span> {staticData.cpu.manufacturer}</p>
            <p><span className={styles.attributeName}>Amount of cores:</span> {staticData.cpu.cores}</p>
            <h2 className={styles.componentName}>Memory</h2>
            <p><span className={styles.attributeName}>Total:</span> {staticData.memory.total} GB</p>
            <h2 className={styles.componentName}>Storage</h2>
            {
                staticData.storage.map((disk, index) =>(
                    <div key={index} className={styles.componentSeparator}>
                        <p><span className={styles.attributeName}>Name:</span> {disk.name}</p>
                        <p><span className={styles.attributeName}>Type:</span> {disk.type}</p>
                        <p><span className={styles.attributeName}>Size:</span> {disk.size} GB</p>
                    </div>
                ))
            }
        </section>
    )
}
export default StaticSection