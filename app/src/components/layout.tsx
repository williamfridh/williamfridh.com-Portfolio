import React, { ReactNode, useState, useEffect } from 'react'
import Prompt from '../components/prompt'
import Header from '../components/header'
import Navigation from '../components/navigation'
import { GeneralSettings, MenuItem } from '../shared/interfaces'
import Social from '../components/social'



const large_screen_width_threshhold = process.env.NEXT_PUBLIC_WP_LARGE_SCREEN_WIDTH_THRESHHOLD



/**
 * File specific interfaces and types.
 */
interface Props {
    children:           ReactNode
    generalSettings:    GeneralSettings
    menuItems:          MenuItem[]
    socialMedia:        MenuItem[]
}



/**
 * The layout component is the main layout for the application.
 */
const Layout: React.FC<Props> = ({ children, generalSettings, menuItems, socialMedia }) => {

    /**
     * Keep states for special effects and layout here.
     * Remember to to add toggles for the extra features
     * on the APP for those who prefer less distractions.
     */
    const [noiseEffect, setNoiseEffect] = useState(true)
    const [showPrompt, setShowPrompt] = useState(false)

    /**
     * Toggle prompt.
     * 
     * This function is used to toggle the prompt.
     * It's passed to the prompt component.
     */
    const togglePrompt = () => {
        setShowPrompt(!showPrompt)
    }

    /**
     * Set data upon activation.
     * 
     * Hide the prompt as default if none large scren
     * is detected.
     */
    useEffect(() => {
        if (window.innerWidth >= Number(large_screen_width_threshhold))
            setTimeout(() => {
                setShowPrompt(true)
            }, 500)
    }, [])
    
    return (
        <>
            {noiseEffect && <div className={`noise-effect`}></div>}
            <Prompt menuItems={menuItems} socialMedia={socialMedia} togglePrompt={togglePrompt} showPrompt={showPrompt} />
            <main id={`content`} className={`
                bg-neutral-700
                w-full
                h-screen
                fixed
                ${showPrompt ? `_scaled` : `_full`}
                right-0
                px-4
                pl-[3.25rem]
                bp-8
                overflow-scroll
                overflow-x-hidden
                flex
                place-content-center
                transition-width
                duration-200
            `}>
                <div className={`h-fit mb-32 w-full sm:w-auto`}>
                    <Header generalSettings={generalSettings} />
                    <Navigation menuItems={menuItems} />
                    <Social socialMedia={socialMedia} />
                    <article>{children}</article>
                </div>
            </main>
        </>
    )
}
export default Layout

