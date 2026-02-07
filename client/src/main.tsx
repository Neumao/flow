import { BrowserRouter } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ApiProvider } from './providers/ApiProvider'
import { AuthProvider } from './providers/AuthProvider'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ApiProvider>
      <AuthProvider>
        <App />
        <Toaster />
      </AuthProvider>
    </ApiProvider>
  </BrowserRouter>,
)
