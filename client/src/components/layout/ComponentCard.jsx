import React, {useState} from "react";
import styles from './ComponentCard.module.css'
import { ArrowIcon } from "../ui/icons/Icons";
export default function ComponentCard({children, icon, title}){
    const [isOpen, setIsOpen] = useState(false)
    return(
        <div className={`${styles.card} ${isOpen? '' : styles.closed}`} role="button">
            <button className={styles.componentHeader} onClick={()=>{setIsOpen(!isOpen)}}>
                {icon}
                <p className={styles.componentTitle}>{title}</p>
                <ArrowIcon className={`${styles.arrow} ${isOpen ? '' : styles.arrowClosed}`}/>
            </button>
            <div className={`${styles.content} `}>
                {children}
            </div>
        </div>
    )
}