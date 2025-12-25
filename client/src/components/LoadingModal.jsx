import React from "react";
import { BarLoader } from 'react-spinners';

export default function LoadingModal({color}){
    return(
        <div style={{width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: "rgba(0, 0, 0, 0.10)", borderRadius: '1rem'}}>
            <BarLoader color={color} width={'80%'}></BarLoader>
        </div>
    )
}