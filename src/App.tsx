import './App.css'
import CustomCursor from './components/ui/CustomCursor'
import ScrollProgress from './components/ui/ScrollProgress'
import KillFeed from './components/ui/KillFeed'
import { ParallaxBackground } from './components/canvas/ParallaxBackground'
import UnifiedCanvas from './components/canvas/UnifiedCanvas'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Experience from './components/sections/Experience'
import Achievements from './components/sections/Achievements'
import Certifications from './components/sections/Certifications'
import Education from './components/sections/Education'
import CodingSection from './components/sections/CodingSection'
import Contact from './components/sections/Contact'
import Footer from './components/layout/Footer'

function App() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <ParallaxBackground />
      <UnifiedCanvas />
      <KillFeed />
      <Navbar />
      <main>
        <Hero />
        <div className="divider" />
        <About />
        <div className="divider" />
        <Skills />
        <div className="divider" />
        <Projects />
        <div className="divider" />
        <Experience />
        <div className="divider" />
        <Achievements />
        <div className="divider" />
        <Certifications />
        <div className="divider" />
        <Education />
        <div className="divider" />
        <CodingSection />
        <div className="divider" />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
