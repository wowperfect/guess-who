import React, { useState, useEffect, useRef } from 'react'
import { generate } from "random-words";
import seedrandom from 'seedrandom';
import { useRoute, Route, Redirect, Link, useLocation } from "wouter";
import { useDebounce, useList, useMedia } from 'react-use';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import './candy.css';
import Flipper from './Flipper.jsx';
import characterPacks from './packs.js'
import Tutorial from './Tutorial.jsx';
import logo from './assets/logo.png'

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

export default function App() {
  const isLargeScreen = useMedia('screen and (min-width: 1099px)')
  const isMediumScreen = useMedia('screen and (min-width: 500px) and (max-width: 1099px)')
  const isSmallScreen = useMedia('screen and (max-width: 499px)')
  const [match, params] = useRoute('/guess-who/:pack/:seed')
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
    navigator.clipboard.writeText(location)
    // toast(`copied to clipboard:\n ${window.location}`, {
    toast(`copied url to clipboard`, {
      position: 'bottom-center',
      closeOnClick: true,
      pauseOnHover: true,
      autoClose: 3000,
      hideProgressBar: true,
    });
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
    setCharacterPackName(e.target.value)
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
    navigate(`/guess-who/${characterPackName}/${seed}`, { replace: true })
  }, [seed])

  useEffect(() => {
    setRng({ rng: seedrandom(seed) })
    setTargetChar(null)
    setValue('pack-name', characterPackName)
    navigate(`/guess-who/${characterPackName}/${seed}`, { replace: true })
  }, [characterPackName])

  useEffect(() => {
    setActiveCharacters(calculateActiveCharacters())
  }, [characterPackName, seed, rng])

  useEffect(refreshTargetCharacter, [characterPackName, seed, activeCharacters, rng])

  return (
    <>
      <Route path="/guess-who/">
        <Redirect to={`/guess-who/${characterPackName}/${seed}`}/>
      </Route>
      <div hidden>
        TODO:
        custom assets for cards, buttons
        animation for card flip
        jjba
      </div>
      <header>
        <nav>
          <div className='logo'><img src={logo}/></div>
          <Tutorial />
        </nav>
      </header>
      <main className='App'>
        <div className='target'>
          <Flipper character={targetChar} img={characterPack[targetChar]} isUp={true}></Flipper>
          <div className='toolbar' style={{alignContent: 'stretch'}}>
            <button onClick={refreshTargetCharacter}>change target</button>
            { !isSmallScreen &&
              <button className='reset' onClick={resetBoard}>reset board</button>
            }
          </div>
        </div>

        <div className={`packs ${isLargeScreen ? 'candy-well' : 'toolbar'}`}>
          { isLargeScreen &&
            <h3 className='candy-prose'>
              choose character pack:
            </h3>
          }
          { isLargeScreen &&
            Object.entries(characterPacks).map(([key, { name }]) =>
              <div key={key}>
                <Link
                  href={`/guess-who/${key}/${seed}`}
                  className={`${key === characterPackName ? 'selected-pack bold' : ''} pack-name`}
                  >{name}</Link>
              </div>
            )
          }
          {
            !isLargeScreen &&
            <select defaultValue={characterPackName} {...register('pack-name', { onChange: onSelectPackNameChange })}>
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
        <div className='seed toolbar' id={seed}>
          { !isSmallScreen &&
            <>
              <input type='text'
                className='candy-input'
                defaultValue={seed}
                {...register('seed', { onChange: onSeedInputChance })}
              />
              <div className='toolbar'>
                <button onClick={refreshSeed}>new board</button>
                <button onClick={doCopy}>share board</button>
              </div>
            </>
          }
          { isSmallScreen &&
            <>
              <input type='text' className='candy-input' defaultValue={seed} {...register('seed', { onChange: onSeedInputChance })} />
              <div className='toolbar'>
                <button onClick={refreshSeed}>new</button>
                <button onClick={doCopy}>share</button>
                <button className='reset' onClick={resetBoard}>reset</button>
              </div>
            </>
          }
        </div>
        <div className='board candy-card'>
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
        <ToastContainer />
      </main>
      <footer>
        <div className='candy-well'>
          <p className='candy-prose'>
            made by <a href='https://wowperfect.net'>wowperfect</a>, with help from <a href='https://wavebeem.com'>wavebeem</a>
          </p>
          <p className='candy-prose'>
            <a href='https://github.com/wowperfect/guess-who'>source code here</a>
          </p>
          <p>
            send character pack requests to
            <br/>
            <pre>guess.who@wowperfect.net</pre>
          </p>
        </div>
      </footer>
    </>
  );
}
