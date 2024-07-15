import React, { useState, useEffect, useRef } from 'react'
import { generate } from "random-words";
import seedrandom from 'seedrandom';
import { useRoute, Route, Redirect, Link, useLocation } from "wouter";
import { useDebounce, useList, useMedia } from 'react-use';
import { useForm } from "react-hook-form";

import './App.css';
// import './candy.css';
import copy from './assets/copy.png'
import refresh from './assets/refresh.png'
import Flipper from './Flipper.jsx';

import * as ssbu from './assets/ssbu.js'
import * as jjk from './assets/jjk.js'
import * as mlp from './assets/mlp.js'
import * as fnaf from './assets/fnaf.js'
import * as dunmesh from './assets/dunmesh.js'
import * as iasip from './assets/iasip.js'
import * as mc from './assets/mc.js'
import * as sonic from './assets/sonic.js'
import * as touhou from './assets/touhou.js'
import * as undertale from './assets/undertale.js'
import * as atla from './assets/atla.js'

const generatePRNGSeed = () =>
  generate({ exactly: 3, maxLength: 7, minLength: 5 }).map(toTitleCase).join('')

const toTitleCase = s =>
  s.charAt(0).toUpperCase() + s.substr(1)

const arrayOf = (n, v) => Array.from(new Array(n)).map(_ => v)

function chooseN(rng, xs, n) {
  const getRandomIdx = () => Math.floor(xs.length * rng())
  let ys = []
  for (let i = 0; i < n; i++) {
    ys = ys.concat(xs.splice(getRandomIdx(), 1))
  }
  return ys
}

const characterPacks = {
  ssbu: {
    name: 'smash bros ultimate',
    pack: ssbu
  },
  jjk: {
    name: 'jujustu kaisen',
    pack: jjk
  },
  mlp: {
    name: 'my little pony',
    pack: mlp
  },
  fnaf: {
    name: 'five nights at freddy\'s',
    pack: fnaf
  },
  dunmesh: {
    name: 'dungeon meshi',
    pack: dunmesh
  },
  iasip: {
    name: 'always sunny in PA',
    pack: iasip
  },
  mc: {
    name: 'minecraft',
    pack: mc
  },
  sonic: {
    name: 'sonic',
    pack: sonic
  },
  touhou: {
    name: 'touhou',
    pack: touhou
  },
  undertale: {
    name: 'undertale',
    pack: undertale
  },
  atla: {
    name: 'avatar the last airbender',
    pack: atla
  },
}

function App() {

  const isSmallScreen = useMedia('screen and (max-width: 80rem)')
  const [match, params] = useRoute('/:pack/:seed')
  const [location, navigate] = useLocation()

  const [seed, setSeed] = useState(() => match ? params.seed : generatePRNGSeed())
  const [characterPackName, setCharacterPackName] = useState(match ? params.pack : 'ssbu')
  const characterPack = characterPacks[characterPackName].pack
  const numCharacters = 30

  const [{rng}, setRng] = useState(() => ({rng: seedrandom(seed)}))
  const [activeCharacters, setActiveCharacters] = useState(calculateActiveCharacters)
  const [targetChar, setTargetChar] = useState(null)
  const [boardUps, {
    set: setBoardUps,
    updateAt: updateFlipper
  }] = useList(() => arrayOf(numCharacters, true))
  const { register, setValue } = useForm()

  function calculateActiveCharacters() {
    const xs = Object.entries(characterPack)
    const ys = chooseN(rng, xs, numCharacters)
    return Object.fromEntries(ys)
  }

  function refreshTargetCharacter() {
    if (!activeCharacters) return
    const characterNames = Object.keys(activeCharacters)
    const target = characterNames[Math.floor(Math.random() * characterNames.length)]
    setTargetChar(target)
  }

  function doCopy() {
    navigator.clipboard.writeText(seed)
  }

  function resetBoard() {
    setBoardUps(arrayOf(numCharacters, true))
  }

  function refreshSeed() {
    const nextSeed = generatePRNGSeed()
    setSeed(nextSeed)
  }

  function onSeedInputChance(e) {
    setSeed(e.target.value)
  }

  function onSelectPackNameChange(e) {
    console.log(e.target.value);
  }

  useEffect(() => {
    if (!params) return
    setSeed(params.seed)
  }, [params?.seed])

  useEffect(() => {
    if (!params) return
    setCharacterPackName(params.pack)
  }, [params?.pack])


  useEffect(() => {
    setRng({rng: seedrandom(seed)})
    setTargetChar(null)
    setValue('seed', seed)
    navigate(`/${characterPackName}/${seed}`, { replace: true })
  }, [seed])

  useEffect(() => {
    setActiveCharacters(calculateActiveCharacters())
  }, [characterPackName, seed, rng])

  useEffect(refreshTargetCharacter, [characterPackName, seed, activeCharacters, rng])

  return (
    <>
    <Route path="/">
      <Redirect to={`/${characterPackName}/${seed}`}/>
    </Route>
      <div hidden>
        TODO:
        custom assets for cards, buttons
        animation for card flip
        jjba
      </div>
      <div className='App'>
        <div className='target'>
          <Flipper character={targetChar} img={characterPack[targetChar]} isUp={true}></Flipper>
          <div style={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <button onClick={refreshTargetCharacter}>change target</button>
            <button className='reset' onClick={resetBoard}>reset board</button>
          </div>
        </div>

        <div className='packs'>
          <h3>
            choose your character pack:
          </h3>
          { !isSmallScreen &&
            Object.entries(characterPacks).map(([key, { name }]) =>
              <div key={key}>
                <Link
                  href={`/${key}/${seed}`}
                  className={`${key === characterPackName ? 'selected-pack bold' : ''} pack-name`}
                  >{name}</Link>
              </div>
            )
          }
          {
            isSmallScreen &&
            <select {...register('pack-name', { onChange: onSelectPackNameChange })}>
              {
                Object.entries(characterPacks).map(([key, { name }]) =>
                  <option key={key} value={key}>
                    {name}
                  </option>
                )
              }
            </select>
          }
        </div>
        <div className='seed' id={seed}>
          <div>
            <h3>this board:</h3>
            <img src={refresh} className='img-button refresh' onClick={refreshSeed}></img>
            <input type='text' defaultValue={seed} {...register('seed', { onChange: onSeedInputChance })} />
            <img src={copy} className='img-button copy' onClick={doCopy}></img>
          </div>
        </div>
        <div className='board'>
          {/* <button className='reset' onClick={resetBoard}>reset board</button> */}
          {!activeCharacters
            ? Array.from(Array(numCharacters)).map((_, i) => <Flipper key={i} />)
            : Object.entries(activeCharacters).map(([character, img], i) =>
              <Flipper
                character={character}
                img={img}
                key={i}
                isUp={boardUps[i]}
                onFlip={() => updateFlipper(i, !boardUps[i])}
              />
            )
          }
        </div>
      </div>
    </>
  );
}

export default App;
