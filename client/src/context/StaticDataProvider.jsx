import React, { useState, useEffect , useContext, createContext, useMemo } from "react"
import { fetchStaticData } from "../services/staticDataService"
const StaticDataContext = createContext(null) 

export const StaticDataProvider = ({children})=>{
    const [staticData , setStaticData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(()=>{
        const getData = async ()=>{
            try{
                setLoading(true)
                const data = await fetchStaticData()
                setStaticData(data)
            }catch (error){
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        getData()
    },[])

    const value = useMemo(()=>({
        staticData,
        loading,
        error
    }), [staticData, loading, error])

    return(
        <StaticDataContext.Provider value={value}>
            {children}
        </StaticDataContext.Provider>
    )
}

export const useStaticData = ()=>{
    const context = useContext(StaticDataContext)
    if (!context) {
        throw new Error('useStaticData must be used inside a StaticDataProvider')
    }
    return context
}