import React from 'react';
import PokemonList from './PokemonList';
import Trainers from './Trainers';

export default function Home() {

  return (
    <div>
      <h1>Home</h1>
      {/* <PokemonList /> */}
      <Trainers />
      <p>Hello, this is a small application, which you can build trainers for Pokemon</p>

    </div>
  )
}
