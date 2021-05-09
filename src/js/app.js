import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import CounterManager from './CounterManager'
import '../less/app.less'

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
            <div className="button" onClick={handleClickButton}>
                <p>{`NEXT ${counter}`}</p>
            </div>
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))