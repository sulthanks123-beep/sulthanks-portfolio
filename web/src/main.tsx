import { createRoot } from 'react-dom/client'
import App from './App'
import '@fontsource/syne/latin-700.css'
import '@fontsource/syne/latin-800.css'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource/mr-dafoe/latin-400.css'
import './styles.css'

createRoot(document.getElementById('root')!).render(<App />)
