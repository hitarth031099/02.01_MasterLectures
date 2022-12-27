import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <p>Lab4: Yufu Liao</p>
      <p>React Marvel API</p>
      <nav>
        <ul>
          <li><Link to="/characters/page/0">Characters</Link></li>
          <li><Link to="/comics/page/0">Comics</Link></li>
          <li><Link to="/series/page/0">Series</Link></li>
        </ul>
      </nav>
    </div>
  )
}
