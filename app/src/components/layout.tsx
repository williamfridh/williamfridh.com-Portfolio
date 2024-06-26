import React, { ReactNode, useState, useEffect } from 'react'
import Prompt from '../components/prompt'
import Header from '../components/header'
import Navigation from '../components/navigation'
import { GeneralSettings, MenuItem } from '../shared/interfaces'
import Social from '../components/social'
import { useSwipeable } from 'react-swipeable'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { useRouter } from 'next/router'



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

    const { width, height } = useWindowDimensions();
	const router = useRouter()

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
     * Swipe handlers.
     * 
     * These handlers are used to detect swipes on the
     * screen and toggle the prompt accordingly.
     */
    const handlers = useSwipeable({
        onSwipedLeft: () => setShowPrompt(false),
        onSwipedRight: () => setShowPrompt(true),
        trackTouch: true,
        trackMouse: false,
        swipeDuration: Infinity,
        delta: width ? width * 0.3 : 1000,
        preventScrollOnSwipe: false,
    });

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

    /**
     * Scroll to  top on navigation.
     */
    useEffect(() => {
        const handleRouteChange = () => {
            document.getElementById('content')?.scrollTo(0, 0)
        }

        // Add event listener for route change
        router.events.on('routeChangeComplete', handleRouteChange)

        // Clean up event listener on component unmount
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange)
        }
    }, [])
    
    return (
        <div {...handlers}>
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
        </div>
    )
}
export default Layout

