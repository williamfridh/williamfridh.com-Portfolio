const setting = (
    input:              string|null,
    programData:        string,
    exitHandler:        (program: string) => void,
    setProgramData:     (data: string) => void,
    settingName:        string,
    setSetting:         (value: any) => void,
    settingValue:       boolean
 ): string => {

    const data = JSON.parse(programData)

    const inputFilter = (input: string): string[] => {
        const inputArr = input.toLowerCase().trim().split(' ')
        return inputArr
    }

    const inputValidation = (inputArr: string[]): void => {
        if (
            inputArr[0] === '' ||
            !['exit', 'set'].includes(inputArr[0])
        )
            throw new Error('Invalid input')
    }

    const setCommand = (value: string): string => {
        if (!['false', 'true'].includes(value))
            throw new Error('Invalid setting value. Must be true or false.')
        if (value === 'true')
            setSetting(true)
        else
            setSetting(false)
        return `Setting value updated to ${value}`
    }

    const stage0 = () => {
        data.stage = 1
        setProgramData(JSON.stringify(data))
        const res = `Current ${settingName} value: ${settingValue}<br/>Possible commands:<br/>exit - Exits the program<br/>set (true/false) - Set a new setting value`
        return res
    }

    const stage1 = () => {
        try {
            // Filter input.
            const filteredInput = inputFilter(input as string)
            // Validate input.
            inputValidation(filteredInput)
            // Handle command.
            switch (filteredInput[0]) {
                case 'exit':
                    exitHandler('')
                    return ''
                case 'set':
                    return setCommand(filteredInput[1])
                default:
                    throw new Error('Invalid input')
            }
        } catch (e: any) {
            return e.message
        }
    }

    switch (data.stage) {
        case 1:
            return stage1()
        default:
            return stage0()
    }

}

export default setting

