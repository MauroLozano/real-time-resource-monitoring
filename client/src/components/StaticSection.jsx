import React from "react";
import styles from '../css/StaticSection.module.css'

function StaticSection(staticData){
    return (
        <section className={styles.staticSection}>
            {!staticData? (<p>Cargando</p>) : (
                <>
                    <h1 className={styles.sectionTitle}>System Components</h1>
                    <h2 className={styles.componentName}>CPU</h2>
                    <p><span className={styles.attributeName}>Brand:</span> {staticData.staticData.cpu.brand}</p>
                    <p><span className={styles.attributeName}>Manufacturer:</span> {staticData.staticData.cpu.manufacturer}</p>
                    <p><span className={styles.attributeName}>Amount of cores:</span> {staticData.staticData.cpu.cores}</p>
                    <h2 className={styles.componentName}>Memory</h2>
                    <p><span className={styles.attributeName}>Total:</span> {staticData.staticData.memory.total} Gb</p>
                    <h2 className={styles.componentName}>Storage</h2>
                    {
                        staticData.staticData.storage.map((disk, index) =>(
                            <div key={index} className={styles.componentSeparator}>
                                <p><span className={styles.attributeName}>Name:</span> {disk.name}</p>
                                <p><span className={styles.attributeName}>Type:</span> {disk.type}</p>
                                <p><span className={styles.attributeName}>Size:</span> {disk.size}</p>
                            </div>
                        ))
                    }
                </>
            )}
        </section>
    )
}
export default StaticSection