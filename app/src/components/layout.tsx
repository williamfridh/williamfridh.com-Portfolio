import React, { ReactNode, useState, useEffect, use } from 'react'
import Prompt from '@/components/prompt/prompt'
import Header from '@/components/header'
import Navigation from '@/components/navigation'
import { GeneralSettings, MenuItem } from '@/shared/interfaces'
import Social from '@/components/social'
import { useSwipeable } from 'react-swipeable'
import useWindowDimensions from '@/hooks/useWindowDimensions'
import { useRouter } from 'next/router'
import useGrainEffect from '@/hooks/useGrainEffect'
import usePrompt from '@/hooks/usePrompt'

interface Props {
    children:           ReactNode
    generalSettings:    GeneralSettings
    menuItems:          MenuItem[]
    socialMedia:        MenuItem[]
}

const Layout: React.FC<Props> = ({ children, generalSettings, menuItems, socialMedia }) => {

    const { width, height } = useWindowDimensions()
	const router = useRouter()
    const { grainEffect, setGrainEffect } = useGrainEffect();
    const { showPrompt, setShowPrompt, layoutReady } = usePrompt();

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

    /**
     * On window resize.
     */
    useEffect(() => {
        if (width && width >= Number(process.env.NEXT_PUBLIC_WP_LARGE_SCREEN_WIDTH_THRESHHOLD)) {
            if (!showPrompt) setShowPrompt(true)
        } else {
            if (showPrompt) setShowPrompt(false)
        }
    }, [width])
    
    return (
        <div {...handlers} className={`
                bg-neutral-700
                h-screen
            `}>
            {grainEffect && <div className={`grain-effect`}></div>}
            <Prompt menuItems={menuItems} socialMedia={socialMedia} togglePrompt={togglePrompt} showPrompt={showPrompt} />
            <main id={`content`} className={`
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
                ${layoutReady && `_layout-ready duration-200`}
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

