import { Toaster } from 'react-hot-toast'
import Nav from './components/Nav'
import Hero from './components/sections/Hero'
import Approach from './components/sections/Approach'
import Sectors from './components/sections/Sectors'
import Strategy from './components/sections/Strategy'
import Performance from './components/sections/Performance'
import Team from './components/sections/Team'
import Faq from './components/sections/Faq'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Approach />
        <Sectors />
        <Strategy />
        <Performance />
        <Team />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            maxWidth: '360px',
            background: '#0A1226',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
          success: { duration: 4500, iconTheme: { primary: '#C9A35B', secondary: '#0A1226' } },
        }}
      />
    </>
  )
}
