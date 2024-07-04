import { Branch, File, promptObj } from "@/shared/interfaces"
import { set } from "date-fns"
import { NextRouter } from "next/router"

const terminal = (
    folder: string,
    root: Branch,
    promptArr: promptObj[],
    input: string,
    setFolder: (folder: string) => void,
    setBranch: (branch: Branch) => void,
    branch: Branch,
    setProgram: (program: string) => void,
    promptData: { [key: string]: { result: string } },
    performeAction: boolean,
    router: NextRouter
) => {

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
        setFolder(``)
        setBranch(root)
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

    const handleRun = (rest: string[]): promptObj[] => {
        // Check if the program is in the list.
        
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

        if (getFileExtension(rest[0]) !== `prog`)
            return [...promptArr, {
                folder: folder,
                command: input,
                result: `File is not a program.`
            }]

        // Start program.
        const fileName  = getFileNameFromPath(rest[0])
        setProgram(fileName)
        return [...promptArr, {
            folder: folder,
            command: input,
            result: `Running ${fileName}`
        }]
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
        case `run`: 									// Run program.
            return handleRun(restOfStringArr)
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

export default terminal

