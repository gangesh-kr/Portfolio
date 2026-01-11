import React from 'react';
import './navigation.css';
import Profile from '../profile/Profile';
import Experience from '../experience/Experience';
import Contact from '../contact-us/Contact';

export default function Navigation() {

    const routes = [
    {name: 'About', component: <Profile />, route: './about'},
    {name: 'Experience', component: <Experience />, route: './experience'},
    {name: 'Contact', component: <Contact />, route: './contact'},
    // {name: 'Home', component: <App />, route: './home'},
  ]
  return (
    <div className='navbar'>
        <div className='left-side'>
            <h2>Gangesh Kumar</h2>
        </div>
        <div className='right-side'>
           { routes.map((route, id) =>
            <div key={id}>
                {route.name}
            </div>
           )}
        </div>
    </div>
  )
}
