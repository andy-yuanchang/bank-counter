import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

const Counter = props => {

    const { name, processingNumber } = props

    const [processedNumberArr, setProcessedNumberArr] = useState([])

    return (
        <div id="counter">
            <div className="title">
                {name}
            </div>
            <div className="content">
                {
                    processingNumber ?? "IDLE" 
                }
            </div>
            <div className="content">
                {
                    processedNumberArr.join(",")
                }
            </div>
        </div>
    )
}

Counter.propTypes = {
    name: PropTypes.string,
    processingNumber: PropTypes.number
}

export default Counter
