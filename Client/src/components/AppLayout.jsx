import Navbar from './Navbar'
import { Outlet } from 'react-router'

const AppLayout = () => {
  return (
    <>
        <Navbar />
        <main>
            <Outlet />
        </main>
    </>
  )
}

export default AppLayout    
