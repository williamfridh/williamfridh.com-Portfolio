/**
 * Name: "Bunker Boss"
 * Goal: Survive for 20 nights with as many people as possible.
 * 
 * Stats: Survivors(start at 20), resources(200)
 * At the end of each day, 1 survivor costs 1 resource.
 * 
 * Each day one action can be taken:
 * - Collect resources ([-1,0,1,2,3,4], if -1, the survivor died)
 * - Scavage resources ([0,1,1,2])
 * - Search for survivors ([-1,0,0,1,2,4])
 * - Wait
 */

const bunkerBoss = (
    input:              string|null,
    programData:        string,
    exitHandler:        (program: string) => void,
    setProgramData:     (data: string) => void
 ): string => {

    const data = JSON.parse(programData)

    const inputFilter = (input: string): string[] => {
        const inputArr = input.toLowerCase().trim().split(' ')
        return inputArr
    }

    const inputValidation = (inputArr: string[]): void => {
        if (
            inputArr[0] === '' ||
            !['scavage', 'farm', 'search', 'wait', 'exit'].includes(inputArr[0])
        )
            throw new Error('Invalid input')
    }

    const generateStatusText = (): string => {
        let status = `# Day: ${data.day} | Survivors: ${data.survivors} | Resources: ${data.resources}`
        status += `<br/><br/># Avalible commands:`
        status += `<br/>- scavage (scavage for resources)`
        status += `<br/>- farm (collect resources in a safe way)`
        status += `<br/>- search (search for survivors)`
        status += `<br/>- wait (skip a day)`
        status += `<br/>- exit (exit the game)`
        return status
    }

    const stage0 = () => {
        data.stage = 1
        data.day = 1
        data.resources = 200
        data.survivors = 20

        status = generateStatusText()

        setProgramData(JSON.stringify(data))
        let res = `## BUNKER BOSS ##`
        res += `<br/>You are the boss of a bunker in a post-apocalyptic world. Your goal is to survive for 20 nights with as many people as possible by making the right decisions. One commend takes one day.`
        res += `<br/><br/>${status}`
        return res
    }

    const scavage = () => {
        const resources = [0,0,5,10,15,20,40,60,70]
        const random = Math.floor(Math.random() * resources.length)
        return resources[random]
    }

    const farm = () => {
        const resources = [0,5,5,10,10,15,20,30]
        const random = Math.floor(Math.random() * resources.length)
        return resources[random]
    }

    const search = () => {
        const survivors = [-3,-2,-1,0,0,1,2,4,5,8]
        const random = Math.floor(Math.random() * survivors.length)
        return survivors[random]
    }

    /**
     * Random scenario:
     * - 70% chance of nothing happening
     * - 10% chance of something happening
     */
    const randomScenario = () => {
        const scenarios = [0,0,0,0,0,0,1,-2,-1,-1]
        const random = Math.floor(Math.random() * scenarios.length)
        switch (scenarios[random]) {
            case(-1):
                data.survivors--
                return 'One survivor died of infection.'
            case(-2):
                data.survivors -= 2
                return 'Two survivors died of infection.'
            case(1):
                data.survivors++
                return 'A surviror has arived at the camp.'
            default:
                return 'Nothing else happened.'
        }
    }

    const checkForVictory = () => {
        if (data.day > 20) {
            return true
        }
        return false
    }

    const checkForLoss = () => {
        if (data.survivors <= 0 || data.resources <= 0) {
            return true
        }
        return false
    }

    const stage1 = () => {
        try {
            // Filter input.
            const filteredInput = inputFilter(input as string)
            // Validate input.
            inputValidation(filteredInput)
            // Handle command.
            let res: string;
            switch (filteredInput[0]) {
                case 'exit':
                    exitHandler('')
                    return ''
                case 'scavage':
                    const scavageRes = scavage()
                    data.resources += scavageRes
                    res = `# You scaved for resources and found ${scavageRes} resource(s).`
                    break
                case 'farm':
                    const farmRes = farm()
                    data.resources += farmRes
                    res = `# You farmed for resources and found ${farmRes} resource(s).`
                    break
                case 'search':
                    const searchRes = search()
                    data.survivors += searchRes
                    res = `# You searched for survivors and found ${searchRes} survivor(s).`
                    break
                case 'wait':
                    res = `# You waited for a day.`
                    break
                default:
                    throw new Error('Invalid input')
            }
            // Daily cost.
            data.resources -= data.survivors
            data.day = data.day + 1
            setProgramData(JSON.stringify(data))
            // Check if the game is over.
            if (checkForLoss()) {
                exitHandler('')
                return `# Game Over!<br/>You lost all your survivors.`
            }
            // Check for victory.
            if (checkForVictory()) {
                exitHandler('')
                return `# Congratulations!<br/>You survived for 20 nights with ${data.survivors} survivors.`
            }
            // Random scenario.
            res += ` ${randomScenario()}`
            // Update status.
            return res + `<br/><br/>${generateStatusText()}`
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

export default bunkerBoss

