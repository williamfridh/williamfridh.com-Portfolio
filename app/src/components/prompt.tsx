import React, { useState, ChangeEvent, useEffect } from 'react'
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
interface FileBranch {
	[key: string]: {
		uri?:		string
		content?:	string
	}
}
interface File {
	content?:	string
	uri?:		string
}
interface SocialMediaFile {
	label:		string
	uri:		string
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
	const menuItemsBranchPart = convertMenuItemsToBranchPart(menuItems)
	const socialMediaBranchPart = convertSocialMediaToBranchPart(socialMedia)
	const root: Branch = {
		...convertMenuItemsToBranchPart(menuItems),
		...baseTree,
		"social-media": convertSocialMediaToBranchPart(socialMedia)
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
			rootpath = rootpath.replaceAll(`//`, `/`)
			rootpath = rootpath.charAt(0) === `/` ? rootpath.substring(1) : rootpath
			const rootPathArrCleaned = rootpath.split(`/`)

			// Remove empty strings.
			for (let i = 0; i < rootPathArrCleaned.length; i++) {
				if (rootPathArrCleaned[i] === ``)
					rootPathArrCleaned.splice(i, 1)
			}

			// Attend ".."
			let finalPathArr = []
			for (let i = 0; i < rootPathArrCleaned.length; i++) {
				if (rootPathArrCleaned[i] === `..`)
					finalPathArr.pop()
				if (i !== rootPathArrCleaned.length - 1 && !isFolder(rootPathArrCleaned[i]))
					return null
				else
					if (rootPathArrCleaned[i] !== `..`)
						finalPathArr.push(rootPathArrCleaned[i])
			}
			const finalPath = finalPathArr.join(`/`)

			let resultingFile: Branch | File = root
			if (finalPathArr.length > 0) {
				for (let i = 0; i < finalPathArr.length; i++) {
					if (
						(i !== finalPathArr.length - 1 && !isFolder(finalPathArr[i])) ||
						(resultingFile as Branch)[finalPathArr[i]] === undefined
					)
						return null
					if (!['.', '..'].includes(finalPathArr[i]))
						resultingFile = (resultingFile as Branch)[finalPathArr[i]]
				}
			}

			return {
				folder: finalPath,
				file: resultingFile
			}
		}

		const getFileExtension = (file: string) => {
			return file.split(`.`)[1]
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
			const getFileResult = getFile(rest[0])
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

		const handleReset = (): promptObj[] => {
			sessionStorage.setItem('promptArr', ``)
			return [{folder: folder, command: input, result: 'Consol reset.'}]
		}

		const handleCat = (rest: string[]): promptObj[] => {
			
			if (rest[0] && isFolder(rest[0]))
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `Not a file.`
				}]

			const file = getFile(rest[0])?.file

			if (file === null || file === undefined)
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `File doesn't exist.`
				}]

			if (file.content === undefined)
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `File doesn't have any content.`
				}]

			return [...promptArr, {folder: folder, command: input, result: file.content as string}]
		}

		const handleView = (rest: string[]): promptObj[] => {
			
			if (rest[0] && isFolder(rest[0]))
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `Not a file.`
				}]

			const file = getFile(rest[0])?.file

			if (file === null || file === undefined)
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `File doesn't exist.`
				}]

			if (file.uri === undefined)
				return [...promptArr, {
					folder: folder,
					command: input,
					result: `File doesn't have a uri.`
				}]

			if (performeAction === true) router.push(file.uri as string)
			
			return [...promptArr, {folder: folder, command: input, result: `Loading file.`}]
		}

		const stringArr = input.split(` `)					// Split up the input string into an array.
		const restOfStringArr = stringArr.slice(1);			// Get the rest of the string array.
		switch(stringArr[0]) {								// Check if the first word is a command.
			case `cd`:										// Change directory.
				return handleCd(restOfStringArr)
			case `view`:									// View file.
				return handleView(restOfStringArr)
			case `cat`:										// View file.
				return handleCat(restOfStringArr)
			case `ls`: 										// List files.
				return handleLs(restOfStringArr)
			case `reset`: 									// Reset console.
				return handleReset()
			default: 										// Invalid command.
				if (promptData[stringArr[0] as keyof typeof promptData])
					return [...promptArr, {
						folder: folder,
						command: input,
						result: promptData[stringArr[0] as keyof typeof promptData].result
					}]
				else
					return invalidCommand()
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
	 * Use effect to load promptArr from session storage on device.
	 */
	useEffect(() => {
		const url = router.asPath
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
			duration-200
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
					placeholder={`~/${folder}$ type help & press enter`}
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

