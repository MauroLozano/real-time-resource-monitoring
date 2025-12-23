import React from "react";
import styles from '../css/StaticSection.module.css'

function StaticSection(staticData){
    return (
        <section className={styles.staticSection}>
            {!staticData? (<p>Cargando</p>) : (
                <>
                    <h2>System Components</h2>
                    <h3>CPU</h3>
                    <p>Brand: {staticData.staticData.cpu.brand}</p>
                    <p>Manufacturer: {staticData.staticData.cpu.manufacturer}</p>
                    <p>Amount of cores: {staticData.staticData.cpu.cores}</p>
                    <h3>Memory</h3>
                    <p>Total: {staticData.staticData.memory.total}</p>
                    <h3>Storage</h3>
                    {
                        staticData.staticData.storage.map((disk, index) =>(
                            <div key={index}>
                                <p>Name: {disk.name}</p>
                                <p>Type: {disk.type}</p>
                                <p>Total size: {disk.size}</p>
                            </div>
                        ))
                    }
                </>
            )}
        </section>
    )
}
export default StaticSection