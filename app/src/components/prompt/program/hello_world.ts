const hello_world = (input: string|null, programData: string, exitHandler: (program: string) => void, setProgramData: (data: string) => void) => {

    const data = JSON.parse(programData)

    const stage0 = () => {
        data.stage = 1
        setProgramData(JSON.stringify(data))
        return "Enter your name..."
    }

    const stage1 = () => {
        exitHandler('')
        return `Hello ${input}!`
    }

    switch (data.stage) {
        case 1:
            return stage1()
        default:
            return stage0()
    }

}

export default hello_world

