import React, { useState, ChangeEvent, useEffect } from 'react'
import PromptRow from './promptRow'
import { Branch, FileBranch, SocialMediaFile, promptObj, File } from '@/shared/interfaces'
import promptData from './prompt.json'
import { MenuItem } from '@/shared/interfaces'
import { useRouter } from 'next/router'
import usePrompt from '@/hooks/usePrompt'
import hello_world from './program/hello_world'
import terminal from './program/terminal'
import set_setting from './program/set_setting'
import useGrainEffect from '@/hooks/useGrainEffect'
import baseTree from './baseTree.json'



/**
 * File specific interfaces and types.
 */
interface PromptProps {
    menuItems:          MenuItem[]
    socialMedia:        MenuItem[]
}



/**
 * Main component code.
 * 
 * This component is a simulated command prompt.
 */
const Prompt: React.FC<PromptProps> = ({menuItems, socialMedia}) => {

	const { layoutReady, setLayoutReady } = usePrompt();
    const { grainEffect, setGrainEffect } = useGrainEffect();
	const {
		showPrompt,
		setShowPrompt,
		branch,
		setBranch,
		promptInput,
		setPromptInput,
		folder,
		setFolder,
		promptArr,
		setPromptArr,
		promptArrIndex,
		setPromptArrIndex,
		program,
		setProgram,
		programData,
		setProgramData
	} = usePrompt();

	/**
	 * The router is used for catching clicks on Netx JS <Link /> elements.
	 */
	const router = useRouter()


	/**
	 * Convert menu items to branch part.
	 */
	const convertMenuItemsToBranchPart = (menuItems: MenuItem[]) => {
		let result: FileBranch = {}
		menuItems.forEach(({label, uri}) => {
		  	result[uri !== `/` ? uri.replaceAll(`/`, ``) + `.html` : `home.html`] = {
				uri: uri === `/` ? `/home` : uri
		  	}
		})
		return result
	}

	/**
	 * Convert social media to branch part.
	 */
	const convertSocialMediaToBranchPart = (socialMedia: SocialMediaFile[]) => {
		let result: FileBranch = {}
		socialMedia.forEach(({label, uri}) => {
			result[`${label.toLocaleLowerCase()}.txt`] = {
				content: uri
			}
		})
		return result
	}


	/**
	 * Construct root. This tree should include fun static branches
	 * and the provided menu items and social media information.
	 */
	const root: Branch = {
		...convertMenuItemsToBranchPart(menuItems),
		...baseTree,
		"social-media": convertSocialMediaToBranchPart(socialMedia)
	}
	setBranch(root)

	/**
	 * Terminate program.
	 */
	const terminateProgram = () => {
		setProgram('')
	}

	/**
	 * Listen for program start.
	 */
	useEffect(() => {
		setProgramData('{}') // Reset program data.
		if (program !== '') { // Initiate program.
			const result: promptObj[] = handleCommand(promptInput)
			setPromptArr(result)
		}
	}, [program])

	/**
	 * Handle Input Change.
	 */
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const filteredInput = inputFilter(event.target.value)
		setPromptInput(filteredInput)
	}

	/**
	 * Filter input.
	 * 
	 * The input filter is made to only allow characters
	 * relevant to the simulated command prompt.
	 */
	const inputFilter = (input: string): string => {
		const regex = /[^a-zA-Z0-9_\.:/\-~\s"]/g
		return input.replace(regex, '').toLowerCase()
	}

	/**
	 * Catch & Handle Submit.
	 * 
	 * Prevents default submision, and updated the array data
	 * with the so far written input. Note that this function is
	 * split into two so that the inner, handleSubmit() can be called
	 * seperatly.
	 */
	const catchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault() // Prevent default form submission behavior.
	  handleSubmit()
	}

	const handleSubmit = () => {
		setPromptArrIndex(0)
		if (promptInput.trim() !== '') {
			const result: promptObj[] = handleCommand(promptInput)
			setPromptArr(result)
			setPromptInput('')
		}
	}
	
	/**
	 * Handle command.
	 * 
	 * Function that takes action based on command.
	 * Note that this function is only called upon actual calls,
	 * thus not when mirroring normal user navigation.
	 */
	const handleCommand = (input: string, performeAction: boolean = true): promptObj[] => {

		switch (program) {

			case 'hello_world.prog':
				return [...promptArr, {
					folder: program,
					command: input,
					result: hello_world(input, programData, terminateProgram, setProgramData)
				}]

			case 'set_grain.prog':
				return [...promptArr, {
					folder: program,
					command: input,
					result: set_setting(
						input,
						programData,
						terminateProgram,
						setProgramData,
						`grainEffect`,
						setGrainEffect
					)
				}]

			case 'set_prompt.prog':
				return [...promptArr, {
					folder: program,
					command: input,
					result: set_setting(
						input,
						programData,
						terminateProgram,
						setProgramData,
						`showPrompt`,
						setShowPrompt
					)
				}]

			default:
				return terminal(
					folder,
					root,
					promptArr,
					input,
					setFolder,
					setBranch,
					branch,
					setProgram,
					promptData,
					performeAction,
					router
				)
		}
	}

	/**
	 * Toggle prompt history.
	 * 
	 * Adds support for navigating the prompt history using
	 * arrow keys. This function uses promptArrIndex as reverse
	 * to find the previous command.
	 */
	const togglePromptHistory = (event: React.KeyboardEvent<HTMLInputElement>) => {
		switch(event.key) {
			case `ArrowUp`:
				if (promptArrIndex < promptArr.length)
					setPromptArrIndex(promptArrIndex + 1)
				break;
			case `ArrowDown`:
				if (promptArrIndex > 0)
					setPromptArrIndex(promptArrIndex - 1)
				break;
		}
	}

	/**
	 * Toggle prompt.
	 */
	const togglePrompt = () => {
		setShowPrompt(!showPrompt)
	}

	/**
	 * Catch prompt array index change.
	 * 
	 * This is where the prompt input is updated based on the
	 * promptArrIndex. This is used to navigate the prompt history.
	 */
	useEffect(() => {
		if (promptArrIndex === 0) {
			setPromptInput(``)
		} else {
			setPromptInput(promptArr[promptArr.length - promptArrIndex].command)
		}
	}, [promptArrIndex])

	/**
	 * Scroll prompt content to bottom.
	 * 
	 * - Use Effect to store state in session storage on device.
	 * 
	 * - This function is used to scroll the prompt content to the bottom
	 * when new content is added. This is done by setting the scrollTop
	 * to the scrollHeight.
	 */
	useEffect(() => {
		sessionStorage.setItem('promptArr', JSON.stringify(promptArr))

		const promptContent = document.getElementById('promptContent');
		if (promptContent) {
			promptContent.scrollTop = promptContent.scrollHeight;
		}
	}, [promptArr]);

	/**
	 * Use effect to load promptArr from session storage on device.
	 */
	useEffect(() => {

		const handleRouteChangeComplete = () => {
			setPromptArr(JSON.parse(sessionStorage.getItem('promptArr') || '[]'))
		}
	
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
	
		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
		}
	}, [])

	/**
	 * Filter url.
	 * 
	 * Remove what's not supported in the prompt.
	 * For instance arguments and query strings.
	 */
	const filterUrl = (url: string): string => {
		const urlParts = url.split('?')
		return urlParts[0]
	}

	/**
	 * Use effect to load promptArr from session storage on device.
	 */
	useEffect(() => {
		const url = filterUrl(router.asPath)
		if (
			promptArr[promptArr.length - 1]?.command.includes(`view`) &&
			promptArr[promptArr.length - 1]?.command.includes((`${url}.html`).replaceAll(`/`, ``))
		) return
		const result: promptObj[] = handleCommand(`view ~${url}.html`, false)
		setPromptArr(result)
	}, [router.asPath]);

    return (
        <div id={`prompt`} className={`
			fixed
			top-0
			bottom-0
			w-full
			xl:w-1/4
			bg-neutral-800
			z-10
			${showPrompt ? '_open' : '_closed'}
			transition-left
			${layoutReady && `_layout-ready duration-200`}
			pr-9
		`}>
			<div id='promptContent' className='h-[calc(100%-48px)] scrollbar-w-8 scrollbar scrollbar-thumb-amber-700 scrollbar-track-transparent overflow-y-scroll'>
				{promptArr.map((content, key) => (
					<PromptRow key={key} index={key} content={content} />
				))}
			</div>
			<form
				onSubmit={catchSubmit}
				className='flex border-t-2 border-amber-400 relative'>
				<input
					type='text'
					value={promptInput}
					onChange={handleInputChange}
					placeholder={program === '' ? `~/${folder}$ type help & press enter` : `Type here`}
					className='
						col-span-1
						h-12
						text-amber-400
						w-full
						bg-transparent
						p-4
						focus:outline-none
						tracking-wider
						text-xl
					'
					onKeyUp={togglePromptHistory}
				/>
				<input
					type='submit'
					value='>>'
					className='
						col-span-1
						h-12
						w-12
						text-amber-400
						absolute
						right-0
						xl:hover:bg-amber-400
						xl:hover:text-neutral-800
						hover:cursor-pointer
						text-3xl
					'
				/>
			</form>
			<div className='
				absolute
				top-0
				bottom-0
				right-0
				text-3xl
				bg-amber-400
				w-9
				select-none
				cursor-pointer
				flex
				items-center
				justify-center
			'
			onClick={togglePrompt}
			>
				{showPrompt ? <>&lt;</> : <>&gt;</>}
			</div>
        </div>
    )
}
export default Prompt

