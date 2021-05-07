import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Counter from './Counter'
import _ from 'lodash'
import axios from 'axios'

let processTimeRange = {
    from: 0.5,
    to: 1.5
}

const CounterManager = props => {

    const { waitingNumber } = props

    const [unProcessedQueue, setUnProcessedQueue] = useState([])
    const [availableCounterArr, setAvailableCounterArr] = useState([])
    const [counterInfoArr, setCounterInfoArr] = useState([])

    useEffect(() => {

        const initialize = () => {
            axios.get('/api/config')
                .then(res => {
                    processTimeRange = _.get(res, "data.processTimeRangeSec", {
                        from: 0.5,
                        to: 1.5
                    })
                    let countersArr = _.get(res, "data.counters", [])
                    countersArr = countersArr.map(name => {
                        return {
                            name,
                            processingNumber: null
                        }
                    })
                    setCounterInfoArr(countersArr)
                    let initialAvailabaleCounterArr = countersArr.map((counter, index) => {
                        return index
                    })
                    setAvailableCounterArr(initialAvailabaleCounterArr)
                })
                .catch(error => {
                    console.error("get app config error", error)
                })
        }

        initialize()

    }, [])

    useEffect(() => {

        const processing = (counterIndex) => {
            const interval = processTimeRange.to - processTimeRange.from
            const base = processTimeRange.from
            const timeoutMs = (Math.random() * interval + base) * 1000
            setTimeout(() => {
                const isUnProcessedQueueEmpty = unProcessedQueue.length === 0
                if (isUnProcessedQueueEmpty) {
                    setCounterInfoArr(preCounterInfoArr => {
                        preCounterInfoArr[counterIndex] = {
                            ...preCounterInfoArr[counterIndex],
                            processingNumber: null
                        }
                        return preCounterInfoArr
                    })
                    setAvailableCounterArr(prevAvailableCounterArr => {
                        return [...prevAvailableCounterArr, counterIndex]
                    })
                    return
                }

                const number = unProcessedQueue.shift()
                setUnProcessedQueue(preUnProcessedQueue => {
                    let [done, ...remain] = preUnProcessedQueue
                    console.log(`${remain} remain`)
                    return remain
                })
                assignTaskToCounter(counterIndex, number)

            }, timeoutMs)
        }

        const assignTaskToCounter = (counterIndex, number) => {
            setCounterInfoArr(preCounterInfoArr => {
                preCounterInfoArr[counterIndex] = {
                    ...preCounterInfoArr[counterIndex],
                    processingNumber: number
                }
                return preCounterInfoArr
            })

            processing(counterIndex)
        }

        const hasAvailableCounter = availableCounterArr.length !== 0

        if (hasAvailableCounter) {
            const counterIndex = availableCounterArr.shift()
            setUnProcessedQueue(prevUnProcessedQueue => {
                return [...prevUnProcessedQueue, waitingNumber]
            })
            const number = unProcessedQueue.shift()
            assignTaskToCounter(counterIndex, number)
            return
        }
        setUnProcessedQueue(prevUnProcessedQueue => {
            return [...prevUnProcessedQueue, waitingNumber]
        })
    }, [waitingNumber])

    return (
         <div id="counter-manager">
            {
                counterInfoArr.map(counterInfo => {
                    return (
                        <Counter
                            name={counterInfo.name}
                            processingNumber={counterInfo.processingNumber}
                        />
                    )
                })
            }
        </div>
    )
}

CounterManager.propTypes = {
    waitingNumber: PropTypes.number
}

export default CounterManager
