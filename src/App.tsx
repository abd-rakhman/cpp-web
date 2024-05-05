import { useState } from 'react'
import './App.css'
import { CppEditor } from './components/CppEditor'

function App() {
  const [code, setCode] = useState('#include<iostream>\n\nusing namespace std;\n\nint main() {\n\tcout << "Hello, World!";\n\treturn 0;\n}')

  return (
    <main>
      <CppEditor code={code} setCode={setCode} />
      <div className='io'>
        <textarea style={{ flex: 1  }}>

        </textarea>
        <div style={{ height: '100%', borderRight: '1px solid rgba(118, 118, 118, 0.4)'}}>

        </div>
        <textarea disabled style={{ flex: 1, }}>
          Your output will be displayed here
        </textarea>
      </div>
      <div className='footer'>
				<button>
					Run
				</button>
      </div>
    </main>
  )
}

export default App;
