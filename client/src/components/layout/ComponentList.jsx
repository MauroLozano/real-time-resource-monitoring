import { useState } from 'react';
import styles from './ComponentList.module.css'
import { ListIcon, CloseIcon } from "../ui/Icons";

export default function ComponentList({children, title, icon}){
    const [isOpen, setIsOpen] = useState(false)
    return(
        <div className={`${styles.listContainer} ${isOpen? '' : styles.closed}`} role='button' tabIndex={0}>
            <button className={styles.listHeader} onClick={()=>{setIsOpen(!isOpen)}}>
                {icon}
                <p className={styles.listTitle}>{title}</p>
                <div className={styles.headerIcon}>
                    {!isOpen? <ListIcon /> : <CloseIcon />}
                </div>
            </button>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}