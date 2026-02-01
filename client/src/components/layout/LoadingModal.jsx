import React from "react";
import { ScaleLoader } from 'react-spinners';
import styles from './LoadingModal.module.css'

export default function LoadingModal(){
    return(
        <div className={styles.loaderContainer}>
            <ScaleLoader color={'#ffbf69'} height={'100px'} margin={'.5rem'} width={'20px'} radius={'.5rem'}></ScaleLoader>
        </div>
    )
}