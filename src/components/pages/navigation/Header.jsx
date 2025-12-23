import React from 'react';
import './header.css';

export default function Header() {
    const words = ["Experience", "About", "Contact"]
  return (
    <div className='navbar'>
        <div className='left-side'>
            <h2>Gangesh Kumar</h2>
        </div>
        <div className='right-side'>
           { words.map((word, id) =>
            <div key={id}>
                {word}
            </div>
           )}
        </div>
    </div>
  )
}
