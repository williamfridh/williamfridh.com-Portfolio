import { max } from "date-fns"
import { use, useEffect } from "react"

/**
 * LoadingAnimation.tsx
 * 
 * Example:
 * [1][0.8][0.6][0.4][0.2]
 * [ ][ ][ ][ ][ ]
 * [ ][ ][ ][ ][ ]
 * [ ][ ][ ][ ][ ]
 * [ ][ ][ ][ ][ ]
 * 
 * Each cell hols a value in the span of [0, 1]
 * to determin the size of the cell color block.
 */
const LoadingAnimation = () => {

    const size: number[] = [10, 10]
    const minSize: number = 0.1
    const maxSize: number = 1

    const data = Array.from(
        { length: size[0] },
        () => Array.from({ length: size[1] }, () => minSize)
    )

    const setSize = (x: number, y: number, size: number) => {
        if (!data[x] || !data[x][y]) throw new Error('Invalid size')
        data[x][y] = size
    }
    
    useEffect(() => {
        console.log(data)
    }, [])
    
    return (
        <div className="loading-animation">
            {data.map((row, i) => (
                <div key={i} className="loading-animation-row">
                    {row.map((col, j) => (
                        <div key={j} className="loading-animation-col">
                            <div
                                className="loading-animation-cell"
                                style={{
                                    width: `${col * 100}%`,
                                    height: `${col * 100}%`
                                }}
                                ></div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
export default LoadingAnimation
