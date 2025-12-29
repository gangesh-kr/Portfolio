import './App.css';
import About from './components/pages/about/About';
import Contact from './components/pages/contact-us/Contact';
import Experience from './components/pages/experience/Experience';
import Navigation from './components/pages/navigation/Navigation';
import Profile from './components/pages/profile/Profile';
import ThreeModel from './components/three/3dModel/ThreeModel';
import Background from './components/three/background/Background';

function App() {

  return (
    <>
    <Background />
      <div className="app">

        {/* Header */}
        <Navigation />
        {/* Hero Section */}


        <Profile />
        <ThreeModel />

        <Experience />
        <Contact />
        <About />
      </div>
    </>
  )
}

export default App