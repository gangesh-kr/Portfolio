import './App.css';
import About from './components/pages/about/About';
import Contact from './components/pages/contact-us/Contact';
import Experience from './components/pages/experience/Experience';
import Navigation from './components/pages/navigation/Navigation';
import Profile from './components/pages/profile/Profile';
import ThreeSection from './components/three/ThreeSection';

function App() {

  return (
    <>
      <div className="app">

        {/* Header */}
        <Navigation />
        {/* Hero Section */}


        <Profile />
        <ThreeSection />

        <Experience />
        <Contact />
        <About />
      </div>
    </>
  )
}

export default App