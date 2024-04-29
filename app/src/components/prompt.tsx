/**
 * IDEAS:
 * - Start of by splitting the prompt into a separate components (string into array). Then travel
 * trough the array and check word by word to execute the command to and catch errors and unsupported
 * commands.
 */

import React, { useState, ChangeEvent, useLayoutEffect, useEffect } from 'react'
import PromptRow from './promptRow'
import { promptObj } from '../shared/interfaces'
import promptData from './prompt.json'
import baseTree from './baseTree.json'
import { MenuItem } from '../shared/interfaces'
import { useRouter } from 'next/router'
import { set } from 'date-fns'
import { get } from 'http'



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
		uri: string
	}
}
interface File {
	content?:	string
	uri?:		string
}
interface Branch {
	[key: string]: Branch|File
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
				uri: uri === `/` ? `/home` : uri
		  	}
		})
		return result
	}

	/**
	 * Construct root. This tree should include fun static branches
	 * and the provided menu items and social media information.
	 */
	const menuItemsBranchPart = convertMenuItemsToBranchPart(menuItems)
	const root: Branch = {
		...menuItemsBranchPart,
		...baseTree
	}

	/**
	 * The data is stored in state and some in session storage.
	 * Session storage is solved futher down in the code.
	 */
	const [branch, setBranch] = useState(root)
	const [promptInput, setPromptInput] = useState('')
	const [folder, setFolder] = useState('')
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
		return Object.keys(targetBranch).join(`<br />`)
	}

	/**
	 * Change directory.
	 * 
	 * Command: cd [folder name]
	 * 
	 * Function used for changing the current directory
	 * of the prompt.
	 */
	const changeDirectory = (targetFolder: string) => {
		setFolder(folder + `/${targetFolder}`)
		const newBranch = (branch as any)[targetFolder]
		setBranch(newBranch)
		return listFiles(newBranch)
	}

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

		const getFileNameFromPath = (file: string) => {
			const fileArr = file.split(`/`)
			const filename = fileArr[fileArr.length - 1]
			return filename
		}

		const isFolder = (file: string) => {
			return getFileExtension(file.split('/').slice(-1)[0]) === undefined
		}

		const getFile = (path: string) => {

			// Combine path with current folder and clean up the new path.
			const fullPath = folder + "/" + path
			const rootPathArr = fullPath.split("~")
			let rootpath = rootPathArr[rootPathArr.length - 1]
			rootpath = rootpath.replaceAll(`./`, ``).replaceAll(`//`, `/`)
			rootpath = rootpath.charAt(0) === `/` ? rootpath.substring(1) : rootpath
			const rootPathArrCleaned = rootpath.split(`/`)

			// Attend ".."
			let finalPathArr = []
			for (let i = 0; i < rootPathArr.length; i++) {
				if (i !== rootPathArrCleaned.length - 1 && !isFolder(rootPathArrCleaned[i]))
					return null
				if (rootPathArrCleaned[i] === `..`)
					finalPathArr.pop()
				else
					finalPathArr.push(rootPathArr[i])
			}
			const finalPath = finalPathArr.join(`/`)

			let resultingFile: Branch | File = branch
			for (let i = 0; i < finalPathArr.length; i++) {
				if (i !== finalPathArr.length - 1 && !isFolder(finalPathArr[i]))
					return null
				resultingFile = (resultingFile as Branch)[finalPathArr[i]]
			}

			return {
				folder: finalPath,
				file: resultingFile
			}
		}

		const getFileExtension = (file: string) => {
			return file.split(`.`)[1]
		}

		const ifFileExists = (file: string) => {
			return getFile(file) !== null
		}

		const invalidCommand = () => {
			return [...promptArr, {
				folder: folder,
				command: input,
				result: `Invalid command.<br />Type "help" for a list of supported commands.`
			}]
		}

		const listFiles = (branchProxy: Branch) => {
			return Object.keys(branchProxy).join(`<br />`);
		};


		const handleCd = (rest: string[]): promptObj[] => {
			const fileName = getFileNameFromPath(rest[0])
			if (!isFolder(fileName))
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `Not a folder.`
				}]
			const getFileResult = getFile(fileName)
			if (getFileResult === null)
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `File doesn't exist.`
				}]
			setFolder(getFileResult.folder)
			setBranch(getFileResult.file as Branch) // Cast getFileResult.file as Branch
			return [...promptArr, {folder: folder, command: input, result: "Changed directory."}]
		}

		const handleLs = (rest: string[]): promptObj[] => {

			if (rest[0] && !isFolder(rest[0]))
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `Not a folder.`
				}]

			let file;
			if (rest.length === 0)
				file = branch
			else
				file = getFile(rest[0])?.file

			if (file === null || file === undefined)
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `Folder doesn't exist.`
				}]

			return [...promptArr, {folder: folder, command: input, result: listFiles(file as Branch)}]
		}

		const stringArr = input.split(` `)					// Split up the input string into an array.
		const restOfStringArr = stringArr.slice(1);			// Get the rest of the string array.
		switch(stringArr[0]) {								// Check if the first word is a command.
			case `cd`:										// Change directory.
				return handleCd(restOfStringArr)
			case `view`:									// View file.
				//return handleView(restOfStringArr)
			case `cat`:										// View file.
				//return handleCat(restOfStringArr)
			case `ls`: 										// List files.
				return handleLs(restOfStringArr)
			case `reset`: 									// Reset console.
				//return handleReset(restOfStringArr)
			case `help`: 									// Help.
				//return handleHelp(restOfStringArr)
			default: 										// Invalid command.
				return invalidCommand()
		}
/*
		switch (input) {
			case 'reset':
				sessionStorage.setItem('promptArr', ``)
				return [{folder: folder, command: input, result: 'Consol reset.'}]
			case 'ls':
				return [...promptArr, {folder: folder, command: input, result: listFiles()}]
		}

		let branchProxy = branch

		const inputArr = input.split(` `)
		const command = inputArr[0]
		const file = inputArr[1]
		const fileArr = inputArr[1].split(`.`)
		const filename = fileArr[0]
		const fileExtension = fileArr[1]

		if (inputArr.length > 1) {

			if (inputArr[1].includes(`~`)) {
				branchProxy = root
				inputArr[1] = inputArr[1].replace(`~/`, ``)
			}
	
			if (
				([`view`, `cat`].includes(command) && file in branchProxy === false) ||
				(command === `cd` && file in branchProxy === false && [`/`].includes(file) === false)
			) // File doesn't exist.
				return [...promptArr, {folder: folder, command: input, result: `File doesn't exist`}]

			switch(command) {
				case `view`:
					if (fileExtension !== `html`) // File is not html.
						return [...promptArr, {folder: folder, command: input, result: `Not a valid html-file`}]
					if (performeAction === true) router.push((branchProxy as any)[file].uri)
						return [...promptArr, {folder: folder, command: input, result: `Loading html-file`}]

				case `cd`:
					return [...promptArr, {folder: folder, command: input, result: changeDirectory(file)}]

				case `cat`:
					if (fileExtension !== `txt`) // File is not txt.
						return [...promptArr, {folder: folder, command: input, result: `Not a valid txt`}]
					return [...promptArr, {folder: folder, command: input, result: (branch as any)[file].content}]
			}

		}

		// Fallback for when the command doesn't fit anything.
		let res: string = (promptData as any)[input] ? (promptData as any)[input]?.result : `Invalid command.<br />Type "help" for a list of supported commands.`
	
		return [...promptArr, {folder: folder, command: input, result: res}]
	
		//return [...promptArr, {command: input, result: `Invalid command.<br />Type "help" for a list of supported commands.`}]
*/
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
		//console.log(JSON.stringify(promptArr))
		sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
	}, [promptArr])

	/**
	 * Use Layout Effect to store state in session storage on device.
	 * This is used in combination to useEffect to store the data
	 * upon DOM change which might accure upon navigation.
	 * 
	 * Necessary to keep the prompt data consistent upon refresh.
	 */
	/*useLayoutEffect(() => {

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

	}, [])*/

	/*useEffect(() => {
		const handleRouteChange = (url: string) => {

			//if (
			//	promptArr[promptArr.length - 1] &&
			//	promptArr[promptArr.length - 1].command.includes(history.state.as)
			//) return // Skip if the command is already in the prompt array.

			const filteredInput = inputFilter(`view ~${url}.html`)
			const result: promptObj[] = handleCommand(filteredInput, false)
			sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
			setPromptArr(result)
		}
	
		// When the component is mounted, subscribe to router changes.
		router.events.on('beforeHistoryChange', handleRouteChange)

		if (!promptArr.length)
			handleRouteChange(history.state.as)
	
		// If the component is unmounted, unsubscribe from the event.
		return () => {
			router.events.off('beforeHistoryChange', handleRouteChange)
		}
	}, [])*/

	useEffect(() => {
		const handleRouteChangeStart = () => {
			//console.log(111)
			//console.log(promptArr)
			//sessionStorage.setItem('promptArr', JSON.stringify(promptArr))
		}
	
		router.events.on('routeChangeStart', handleRouteChangeStart)
	
		return () => {
			router.events.off('routeChangeStart', handleRouteChangeStart)
		}
	}, [])

	useEffect(() => {

		const handleRouteChangeComplete = () => {
			console.log(sessionStorage.getItem('promptArr'))
			setPromptArr(JSON.parse(sessionStorage.getItem('promptArr') || '[]'))
		}
	
		router.events.on('routeChangeComplete', handleRouteChangeComplete)
	
		return () => {
			router.events.off('routeChangeComplete', handleRouteChangeComplete)
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
			xl:w-1/4
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

