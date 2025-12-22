import React from "react";
import styles from '../css/StaticSection.module.css'
const serverUrl = 'http://localhost:3000'

import { useState, useEffect } from "react";

function StaticSection(){
    const [staticData, setStaticData] = useState(null) 
    useEffect(()=>{
    fetch(`${serverUrl}/staticData`)
        .then((res)=>{
        if(!res.ok) console.error('Server error') 
        return res.json()
        })
        .then(data =>{ 
        setStaticData(data)
        })
        .catch(error => console.error(error))
    }, [])

    return (
        <section className={styles.staticSection}>
            {!staticData? (<p>Cargando</p>) : (
                <>
                    <h2>Static Data</h2>
                    <h3>CPU</h3>
                    <p>Brand: {staticData.cpu.brand}</p>
                    <p>Manufacturer: {staticData.cpu.manufacturer}</p>
                    <p>Amount of cores: {staticData.cpu.cores}</p>
                    <h3>Memory</h3>
                    <p>Total: {staticData.memory.total}</p>
                    <h3>Storage</h3>
                    {
                        staticData.storage.map((disk, index) =>(
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