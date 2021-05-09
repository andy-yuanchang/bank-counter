import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Counter from './Counter'
import _ from 'lodash'
import axios from 'axios'

let processTimeRange = {
    from: 0.5,
    to: 1.5
}

let unProcessedQueue = []
let availableCounterArr = []

const CounterManager = props => {

    const { waitingNumber } = props

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
                    availableCounterArr = countersArr.map((counter, index) => {
                        return index
                    })
                })
                .catch(error => {
                    console.error("get app config error", error)
                })
        }

        initialize()

    }, [])

    useEffect(() => {

        const resetCounterStatus = (counterIndex) => {
            setCounterInfoArr(preCounterInfoArr => {
                const [...arr] = preCounterInfoArr
                arr[counterIndex].processingNumber = null
                return arr
            })
            availableCounterArr.push(counterIndex)
        }

        const processing = (counterIndex) => {
            const interval = processTimeRange.to - processTimeRange.from
            const base = processTimeRange.from
            const timeoutMs = (Math.random() * interval + base) * 1000
            setTimeout(() => {
                const isUnProcessedQueueEmpty = unProcessedQueue.length === 0
                if (isUnProcessedQueueEmpty) {
                    resetCounterStatus(counterIndex)
                    return
                }

                const number = unProcessedQueue.shift()
                assignTaskToCounter(counterIndex, number)

            }, timeoutMs)
        }

        const assignTaskToCounter = (counterIndex, number) => {
            setCounterInfoArr(preCounterInfoArr => {
                const [...arr] = preCounterInfoArr
                arr[counterIndex].processingNumber = number
                return arr
            })

            processing(counterIndex)
        }

        const hasAvailableCounter = availableCounterArr.length !== 0
        const isUnProcessedQueueEmpty = unProcessedQueue.length === 0
        const shouldAssignTask = hasAvailableCounter && isUnProcessedQueueEmpty

        if (waitingNumber === 0) return
        if (shouldAssignTask) {
            const counterIndex = availableCounterArr.shift()
            assignTaskToCounter(counterIndex, waitingNumber)
            return
        }

        unProcessedQueue.push(waitingNumber)

    }, [waitingNumber])

    return (
        <div id="counter-manager">
            <div className="un-processed-queue">
                {`Number of waiting people: ${unProcessedQueue.length}`}
            </div>
            <table className="table">
                <thead>
                    <th colspan="1">Counter Name</th>
                    <th colspan="1">Number in Processing</th>
                    <th colspan="2">Processed Number Queue</th>
                </thead>
                <tbody>
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
                </tbody>
            </table>

        </div>
    )
}

CounterManager.propTypes = {
    waitingNumber: PropTypes.number
}

export default CounterManager
