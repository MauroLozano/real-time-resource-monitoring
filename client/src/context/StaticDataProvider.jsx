import React, { useState, useEffect , useContext, createContext } from "react"

const StaticDataContext = createContext(null) 
const serverUrl = 'http://localhost:3000'

export const StaticDataProvider = ({children})=>{
    const [staticData , setStaticData] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        fetch(`${serverUrl}/staticData`)
            .then((res)=>{
                if(!res.ok) console.error('Server error') 
                return res.json()
            })
            .then(data =>{ 
                setStaticData(data)
                setLoading(false)
            })
            .catch(error => console.error(error))
    },[])
    return(
        <StaticDataContext.Provider value={{staticData, loading}}>
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