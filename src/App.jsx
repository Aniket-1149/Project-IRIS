import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Section from './components/Land'
import Copyright from './components/Copyright'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <div className=''>
      <Section />
      <Copyright/>
       </div>
    </>
  )
}

export default App
