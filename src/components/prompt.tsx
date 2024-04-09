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
	  	type: string,
		uri: string
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


	/**
	 * Convert menu items to branch part.
	 */
	const convertMenuItemsToBranchPart = (menuItems: MenuItem[]) => {
		let result: MenuItemsBranch = {}
		menuItems.forEach(({label, uri}) => {
		  	result[uri !== `/` ? uri.replaceAll(`/`, ``) + `.html` : `home.html`] = {
				type: `html`,
				uri: uri
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
		type: `folder`,
		...menuItemsBranchPart,
		...baseTree
	}

	/**
	 * Data.
	 * 
	 * The data is stored in state and session storage.
	 */
	const [branch, setBranch] = useState(root)
	const [promptInput, setPromptInput] = useState('')
	const [promptArr, setPromptArr] = useState<promptObj[]>([])
	const [promptArrIndex, setPromptArrIndex] = useState(0)
	  

	/**
	 * List files.
	 * 
	 * Command: ls
	 * 
	 * Function used for listing what in the current directory.
	 * Filters our any meta-data.
	 */
	const listFiles = (targetBranch: any = branch) => {
		const list = Object.keys(targetBranch)
						.filter(obj => [`type`].includes(obj) === false)
						.map(obj => (targetBranch as any)[obj].type === `folder` ? obj : `${obj}.${(targetBranch as any)[obj].type}`)
						.join(`<br />`)
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
		const newBranch = (branch as any)[folder]
		setBranch(newBranch)
		return listFiles(newBranch)
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
	 * 
	 * @param command string to handle.
	 * @returns promptArr.
	 */
	const handleCommand = (input: string, performeAction: boolean = true): promptObj[] => {''

		switch (input) {
			case 'reset':
				sessionStorage.setItem('promptArr', ``)
				return [{command: input, result: 'Consol reset.'}]
			case 'ls':
				return [...promptArr, {command: input, result: listFiles()}]
		}

		let branchProxy = branch

		const inputArr = input.split(` `)

		if (inputArr.length > 1) {

			if (inputArr[1].includes(`~`)) {
				branchProxy = root
				inputArr[1] = inputArr[1].replace(`~/`, ``)
			}
	
			if ([`view`, `cd`, `cat`].includes(inputArr[0]) && inputArr[1] in branchProxy === false) { // File doesn't exist.
				return [...promptArr, {command: input, result: `File doesn't exist`}]
			}

			switch(inputArr[0]) {
				case `view`:
					if ((branchProxy as any)[inputArr[1]].type !== `html`) // File is not html.
						return [...promptArr, {command: input, result: `Not a valid html`}]
					if (performeAction === true) router.push((branchProxy as any)[inputArr[1]].uri)
					return [...promptArr, {command: input, result: `Loading html-file`}]

				case `cd`:
					return [...promptArr, {command: input, result: changeDirectory(inputArr[1])}]

				case `cat`:
					if ((branchProxy as any)[inputArr[1]].type !== `txt`) // File is not txt.
						return [...promptArr, {command: input, result: `Not a valid txt`}]
					return [...promptArr, {command: input, result: (branch as any)[inputArr[1]].content}]
			}

		}

		// Fallback for when the command doesn't fit anything.
		let res: string = (promptData as any)[input] ? (promptData as any)[input]?.result : `Invalid command.<br />Type "help" for a list of supported commands.`
	
		return [...promptArr, {command: input, result: res}]
	
		//return [...promptArr, {command: input, result: `Invalid command.<br />Type "help" for a list of supported commands.`}]

	}

	/**
	 * Handle prompt history.
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
	 * Use Effect to store state in session storage on device.
	 */
	useEffect(() => {
		sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
	}, [promptArr])

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
			const filteredInput = inputFilter(`view ~/${history.state.as.replaceAll(`/`, ``)}.html`)
			const result: promptObj[] = handleCommand(filteredInput, false)
			setPromptArr(result)
		} else {
			sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
		}

	}, [])

	useEffect(() => {
		const handleRouteChange = (url: string) => {

			if (
				promptArr[promptArr.length - 1] &&
				promptArr[promptArr.length - 1].command.includes(history.state.as)
			) return // Skip if the command is already in the prompt array.

			const filteredInput = inputFilter(`view ~${url}.html`)
			const result: promptObj[] = handleCommand(filteredInput)
			setPromptArr(result)
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
						hover:bg-amber-400
						hover:text-neutral-800
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

