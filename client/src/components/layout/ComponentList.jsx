import { useState } from 'react';
import styles from './ComponentList.module.css'
import { ListIcon, CloseIcon } from "../ui/Icons";

export default function ComponentList({children, title, icon}){
    const [isOpen, setIsOpen] = useState(false)
    return(
        <div className={`${styles.listContainer} ${isOpen? '' : styles.closed}`} role='button' tabIndex={0}>
            <div className={styles.listHeader} onClick={()=>{setIsOpen(!isOpen)}}>
                {icon}
                <h3 className={styles.listTitle}>{title}</h3>
                <div className={styles.headerIcon}>
                    {!isOpen? <ListIcon /> : <CloseIcon />}
                </div>
            </div>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}