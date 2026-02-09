import { useState } from 'react'
import './App.css'

function App() {
  const [buttonText, setButtonText] = useState('Click me to fetch data')

  const handleClick = async () => {
    try {
      const response = await fetch('https://example-api.iamscribe.org')
      const data = await response.text()
      setButtonText(data)
    } catch (error) {
      setButtonText('Error fetching data')
      console.error('Error:', error)
    }
  }

  return (
    <>
      <h1>Simple React App</h1>
      <div className="card">
        <button onClick={handleClick}>
          {buttonText}
        </button>
      </div>
    </>
  )
}

export default App
