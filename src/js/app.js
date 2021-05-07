import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import CounterManager from './CounterManager'

const App = () => {

    const [counter, setCounter] = useState(0)

    const handleClickButton = () => {
        setCounter(counter + 1)
    }

    return (
        <div id="app">
            <CounterManager
                waitingNumber={counter}
            />
            <button onClick={handleClickButton}>{`NEXT ${counter}`}</button>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))