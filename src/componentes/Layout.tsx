import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Header from './Header'

const Layout = () => {

  return (
    <div className='min-h-screen dark:text-primary-content bg-primary-content dark:bg-slate-950'>
        <Header/>
        <div className='py-8 px-6'>
        <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default Layout