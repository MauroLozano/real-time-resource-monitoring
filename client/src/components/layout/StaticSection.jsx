import React from "react";
import styles from './StaticSection.module.css'
import LoadingModal from './LoadingModal'
import ComponentAttribute from "./ComponentAttribute.jsx";
import ComponentCard from "./componentCard.jsx";
import { useStaticData } from "../../context/StaticDataProvider.jsx";
import {EyeClosedIcon, EyeOpenIcon, BrainIcon, ProcessorIcon, SdCardIcon, MachineIcon} from '../ui/Icons.jsx'
function StaticSection({ onToggle, isCollapsed}){
    const { staticData, loading } = useStaticData()
    if(!staticData && loading){
        return (
            <section className={styles.staticSection}>
                <LoadingModal color='#cbf3f0'></LoadingModal>
            </section>
        )
    }
    const getOsVersionLabel = (platform)=>{
        if (platform === 'linux') return 'Kernel V.'
        if (platform === 'win32') return 'Build V.' 
        return 'Release'
    }
    return (
        <section className={`${styles.staticSection} `}>
            <div className={`${styles.toggleOpenContainer}`} onClick={onToggle}>
                {
                    isCollapsed?
                        <EyeClosedIcon></EyeClosedIcon>
                    :
                        <EyeOpenIcon></EyeOpenIcon>
                }
            </div>
            <div className={styles.scrollableContainer}>
                <div className={`${isCollapsed? styles.staticSectionContentCollapsed : ''}`}>
                    <h1 className={styles.sectionTitle}>System Components</h1>
                    <ComponentCard icon={<ProcessorIcon />} title={'CPU'}>
                        <ComponentAttribute label='Brand' value={staticData.cpu.brand}></ComponentAttribute>
                        <ComponentAttribute label='Manufacturer' value={staticData.cpu.manufacturer}></ComponentAttribute>
                        <ComponentAttribute label='Physical Cores' value={staticData.cpu.physicalCores}></ComponentAttribute>
                    </ComponentCard>
                    <ComponentCard icon={<BrainIcon />} title={'Memory'}>
                        <ComponentAttribute label='Total' value={staticData.memory.total} ></ComponentAttribute>
                    </ComponentCard>
                    {
                        staticData.storage.map((disk, index) =>(
                            <ComponentCard key={index} icon={<SdCardIcon/>} title={'Storage'}>
                                <div className={styles.componentSeparator}>
                                    <ComponentAttribute label='Name' value={disk.name}></ComponentAttribute>
                                    <ComponentAttribute label='Type' value={disk.type}></ComponentAttribute>
                                    <ComponentAttribute label='Size' value={disk.size}></ComponentAttribute>
                                </div>
                            </ComponentCard>
                        ))
                    }
                    <ComponentCard icon={<MachineIcon/>} title={'OS'}>
                        <ComponentAttribute label='Hostname' value={staticData.os.hostname}></ComponentAttribute>
                        <ComponentAttribute label='Platform' value={staticData.os.platform}></ComponentAttribute>
                        <ComponentAttribute label='Architecture' value={staticData.os.architecture}></ComponentAttribute>
                        <ComponentAttribute 
                            label={getOsVersionLabel(staticData.os.platform)} 
                            value={staticData.os.release}>
                        </ComponentAttribute>
                        <ComponentAttribute label='Type' value={staticData.os.type}></ComponentAttribute>
                    </ComponentCard>
                </div>
            </div>
        </section>
    )
}
export default StaticSection