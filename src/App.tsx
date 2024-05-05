import { useState } from 'react'
import './App.css'
import { CppEditor } from './components/CppEditor'

function App() {
  const [code, setCode] = useState('#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}')

  return (
    <main style={{ height: '100vh', width: '100vw'}}>
      <div className='header'>
				<button>
					Run
				</button>
      </div>
      <CppEditor code={code} setCode={setCode} />
      <div>

      </div>
    </main>
  )
}

export default App;
