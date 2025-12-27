import './App.css';
import Header from './components/pages/navigation/Header';
import Profile from './components/pages/profile/Profile';
import ParticlesCursor from './components/particle-cursor/particle-cursor';
import ThreeSection from './components/three/ThreeSection';

function App() {
  return (
    <>
      <div className="app">
        <ParticlesCursor />
        {/* Header */}
        <Header />
        {/* Hero Section */}
        <div className='row'>
          <div className='col-12 col-md-6'>
            <Profile />
          </div>
          <div className='col-12 col-md-6'>
            <ThreeSection />
          </div>
        </div>

      </div>
    </>
  )
}

export default App