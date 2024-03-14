import React, { useState, ChangeEvent, useLayoutEffect, useEffect } from 'react';
import PromptRow from './promptRow';
import { promptObj } from '../shared/interfaces';



/**
 * Main component code.
 */
const Prompt: React.FC<{}> = () => {

	/**
	 * Data.
	 */
	const [promptInput, setPromptInput] = useState('');
	const [promptArr, setPromptArr] = useState<promptObj[]>([]);



	/**
	 * Handle Input Change.
	 */
	const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		const filteredInput = inputFilter(event.target.value);
		setPromptInput(filteredInput);
	};



	/**
	 * Filter input.
	 * 
	 * The input filter is made to only allow characters
	 * relevant to the simulated command prompt.
	 */
	const inputFilter = (input: string): string => {
		const regex = /[^a-zA-Z0-9,:/"]/g;
		return input.replace(regex, '').toLowerCase();
	}



	/**
	 * Handle Submit.
	 * 
	 * @param event cought.
	 * 
	 * Prevents default submision, and updated the array data
	 * with the so far written input.
	 */
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	  event.preventDefault(); // Prevent default form submission behavior.
	  if (promptInput.trim() !== '') {
		const result: promptObj[] = handleCommand(promptArr, promptInput);
		setPromptArr(result);
		setPromptInput('');
	  }
	};



	/**
	 * Handle command.
	 * 
	 * Function that takes action based on command.
	 */
	const handleCommand = (promptArr: promptObj[], command: string): promptObj[] => {

		switch (command) {
			case ':reset':
				return [{command: promptInput, result: 'Consol reset.'}];
		}

		let result: string = '';
		switch (command) {
			case ':help':
				result = '# Help Commands<br />availiable is listed below.';
				break;
			case ':gurka':
				result = 'Johan.';
				break;
			case ':version':
				result = 'Version 1337.42';
				break;
		}
		return [...promptArr, {command: promptInput, result: result}]

	}



	/**
	 * Use Effect to store state in session storage on device.
	 */
	useEffect(() => {
		sessionStorage.setItem('promptArr', JSON.stringify(promptArr));
	}, [promptArr])

	useEffect(() => {
		sessionStorage.setItem('promptInput', promptInput);
	}, [promptInput])



	/**
	 * Use Layout Effect to store state in session storage on device.
	 * This is used in combination to useEffect to store the data
	 * upon DOM change which might accure upon navigation.
	 */
	useLayoutEffect(() => {

		const storedPromptArr = sessionStorage.getItem('promptArr');
		const storedPromptInput = sessionStorage.getItem('promptInput');

		if (storedPromptArr) {
			const promptArr = storedPromptArr ? JSON.parse(storedPromptArr) : [];
			setPromptArr(promptArr);
		} else {
			sessionStorage.setItem('promptArr', JSON.stringify(promptArr));
		}

		if (storedPromptInput) {
			setPromptInput(storedPromptInput ? storedPromptInput : '');
		} else {
			sessionStorage.setItem('promptInput', promptInput);
		}

	}, [])



	/**
	 * Element.
	 */
    return (
        <div className='fixed top-0 h-screen w-1/4 bg-neutral-800 border-r-2 border-amber-400'>
			<div className='h-[calc(100%-48px)]'>
				{promptArr.map((content, key) => (
					<PromptRow key={key} index={key} content={content} />
				))}
			</div>
			<form
				onSubmit={handleSubmit}
				className='flex border-t-2 border-amber-400'>
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
						text-xl
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
        </div>
    );
};
export default Prompt;

