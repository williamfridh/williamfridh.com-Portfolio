const set_setting = (
    input: string|null,
    programData: string,
    exitHandler: (program: string) => void,
    setProgramData: (data: string) => void,
    settingName: string,
    setSetting: (value: any) => void
) => {

    const data = JSON.parse(programData)

    const inputValidation = (input: string) => {
        const filteredInput = input.toLowerCase().trim()
        if (filteredInput === "true") return true
        if (filteredInput === "false") return false
        throw new Error('Invalid input')
    }

    const stage0 = () => {
        data.stage = 1
        setProgramData(JSON.stringify(data))
        return `Enter "true" or "false"...`
    }

    const stage1 = () => {
        try {
            const filteredInput = inputValidation(input as string)
            setSetting(filteredInput)
            exitHandler('')
            return `${settingName} set to ${input}!`
        } catch (error) {
            return `Invalid input. Please enter "true" or "false"...`
        }
    }

    switch (data.stage) {
        case 1:
            return stage1()
        default:
            return stage0()
    }

}

export default set_setting

