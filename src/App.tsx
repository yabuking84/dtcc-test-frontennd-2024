import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { router } from '@/routes'

function App() {
    return <RouterProvider router={createBrowserRouter(router)} />
}

export default App
