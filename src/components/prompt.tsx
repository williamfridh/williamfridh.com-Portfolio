import React, { useState, ChangeEvent, useLayoutEffect, useEffect } from 'react'
import PromptRow from './promptRow'
import { promptObj } from '../shared/interfaces'
import promptData from './prompt.json'
import baseTree from './baseTree.json'
import { MenuItem } from '../shared/interfaces'
import { useRouter } from 'next/router'



/**
 * File specific interfaces and types.
 */
interface PromptProps {
    menuItems:          MenuItem[]
    socialMedia:        MenuItem[]
	togglePrompt:	   	() => void
	showPrompt:		   	boolean
}
interface MenuItemsBranch {
	[key: string]: {
	  type: string
	}
  
}



/**
 * Main component code.
 * 
 * This component is a simulated command prompt.
 */
const Prompt: React.FC<PromptProps> = ({menuItems, socialMedia, togglePrompt, showPrompt}) => {

	/**
	 * The router is used for catching clicks on Netx JS <Link /> elements.
	 */
	const router = useRouter()

	/*const createObjectFromMenuItems = () => {
		const acc = {}
		return menuItems.reduce(({label, uri}: MenuItem) => {
			acc[label] = uri;
			return acc;
		}, {});
	}*/


	/**
	 * Convert menu items to branch part.
	 */
	const convertMenuItemsToBranchPart = (menuItems: MenuItem[]) => {
		let result: MenuItemsBranch = {}
		menuItems.forEach(({label, uri}) => {
		  	result[uri !== `/` ? uri : `/home/`] = {
				type: `page`
		  	}
		})
		return result
	}

	/**
	 * Construct root. This tree should include fun static branches
	 * and the provided menu items and social media information.
	 */
	const menuItemsBranchPart = convertMenuItemsToBranchPart(menuItems)
	const root = {
		menuItemsBranchPart,
		baseTree
	}
	console.log(root)

	/**
	 * Data.
	 * 
	 * The data is stored in state and session storage.
	 */
	const [branch, setBranch] = useState(root)
	const [promptInput, setPromptInput] = useState('')
	const [promptArr, setPromptArr] = useState<promptObj[]>([])
	  

	/**
	 * List files.
	 * 
	 * Command: ls
	 * 
	 * Function used for listing what in the current directory.
	 */
	const listFiles = () => {
		//console.log(branch)
		const list = branch.map((item) => typeof item === `string` ?  `${item}<br />` : `${Object.keys(item)}<br />`).join(``)
		return list
	}

	/**
	 * Change directory.
	 * 
	 * Command: cd [folder name]
	 * 
	 * Function used for changing the current directory
	 * of the prompt.
	 */
	const changeDirectory = (folder: string) => {
		//setBranch(branch[])
	}

	/**
	 * Handle Input Change.
	 * 
	 * @param event cought.
	 * @returns void.
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
	 * 
	 * @param input string to filter.
	 * @returns filtered string.
	 */
	const inputFilter = (input: string): string => {
		const regex = /[^a-zA-Z0-9\.:/\-~\s"]/g
		return input.replace(regex, '').toLowerCase()
	}

	/**
	 * Catch & Handle Submit.
	 * 
	 * Prevents default submision, and updated the array data
	 * with the so far written input. Note that this function is
	 * split into two so that the inner, handleSubmit() can be called
	 * seperatly.
	 * 
	 * @param event cought.
	 * @returns void.
	 */
	const catchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault() // Prevent default form submission behavior.
	  handleSubmit()
	}

	const handleSubmit = () => {
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
	 * 
	 * @param command string to handle.
	 * @returns promptArr.
	 */
	const handleCommand = (input: string): promptObj[] => {

		//console.log(`handleCommand:`)
		//console.log(promptArr)
		//console.log(input)

		switch (input) {
			case 'reset':
				return [{command: input, result: 'Consol reset.'}]
			case 'ls':
				return [...promptArr, {command: input, result: listFiles()}]
		}

		const inputArr = input.split(` `)

		console.log(branch)

		if (inputArr[0] === `view` && branch.includes(inputArr[1])) {
			router.push(inputArr[1].replace(`.html`, ``))
			return [...promptArr, {command: input, result: `Loading ${inputArr[1]}...`}]
		}

		let res: string = (promptData as any)[input] ? (promptData as any)[input]?.result : `Invalid command.<br />Type "help" for a list of supported commands.`

		return [...promptArr, {command: input, result: res}]

		//return [...promptArr, {command: input, result: `Invalid command.<br />Type "help" for a list of supported commands.`}]

	}

	/**
	 * Use Effect to store state in session storage on device.
	 */
	useEffect(() => {
		sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
	}, [promptArr])

	//useEffect(() => {
	//	sessionStorage.setItem('promptInput', promptInput)
	//}, [promptInput])

	/**
	 * Use Layout Effect to store state in session storage on device.
	 * This is used in combination to useEffect to store the data
	 * upon DOM change which might accure upon navigation.
	 * 
	 * Necessary to keep the prompt data consistent upon refresh.
	 */
	useLayoutEffect(() => {

		const storedPromptArr = sessionStorage.getItem('promptArr')
		//const storedPromptInput = sessionStorage.getItem('promptInput')

		if (storedPromptArr) {
			const promptArr = storedPromptArr ? JSON.parse(storedPromptArr) : []
			setPromptArr(promptArr)
		} else {
			sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
		}

		//if (storedPromptInput) {
		//	setPromptInput(storedPromptInput ? storedPromptInput : '')
		//} else {
		//	sessionStorage.setItem('promptInput', promptInput)
		//}

	}, [])

	useEffect(() => {
		const handleRouteChange = (url: string) => {

			console.log(`handleRouteChange:`)
			console.log(promptArr)

			const filteredInput = inputFilter(`view ~${url}.html`)
			console.log(filteredInput)
			const result: promptObj[] = handleCommand(filteredInput)
			setPromptArr(result)

			// It happens. but we must wait.
			// Add "fake" prompt command to keep concistency.
			//console.log(promptInput)
			//handleSubmit()
		}
	
		// When the component is mounted, subscribe to router changes.
		router.events.on('routeChangeComplete', handleRouteChange)
	
		// If the component is unmounted, unsubscribe from the event.
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [])

	/**
	 * Element.
	 */
    return (
        <div id={`prompt`} className={`
			fixed
			top-0
			bottom-0
			w-full
			sm:w-1/4
			bg-neutral-800
			z-10
			${showPrompt ? '_open' : '_closed'}
			transition-left
			duration-200
			pr-9
		`}>
			<div className='h-[calc(100%-48px)]'>
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
					placeholder='type :help or command and press enter...'
					className='
						col-span-1
						h-12
						text-amber-400
						w-full
						bg-transparent
						p-4
						focus:outline-none
						tracking-wider
						text-base
					' />
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
						hover:bg-amber-400
						hover:text-neutral-800
						hover:cursor-pointer
						text-3xl
					' />
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

