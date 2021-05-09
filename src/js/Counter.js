import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const Counter = props => {

    const { name, processingNumber } = props

    const [processedNumberArr, setProcessedNumberArr] = useState([])

    useEffect(() => {
        if (processingNumber) {
            processedNumberArr.push(processingNumber)
            setProcessedNumberArr(processedNumberArr)
        }  
    }, [processingNumber])

    return (
        <tr id="counter">
            <td className="title">
                {name}
            </td>
            <td className="status">
                {
                    processingNumber ?? "IDLE" 
                }
            </td>
            <td className="content" colSpan="2">
                {
                    processedNumberArr.filter(n => n !== processingNumber).join(",")
                }
            </td>
        </tr>
    )
}

Counter.propTypes = {
    name: PropTypes.string,
    processingNumber: PropTypes.number
}

export default Counter
