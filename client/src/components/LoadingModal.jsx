import React from "react";
import { BarLoader } from 'react-spinners';

export default function LoadingModal({color}){
    return(
        <div style={{width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <BarLoader color={color} width={'80%'}></BarLoader>
        </div>
    )
}