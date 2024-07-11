import unknown from './assets/unknown.png'
import React, {useState} from "react";

export default function Flipper ({img, character, isUp, onFlip}) {

  const upOrDown = isUp ? 'up' : 'down'

  return <>
    <div
      onClick={onFlip}
      className={`flipper ${upOrDown}`}
    >
      <img src={img || unknown} alt={character}></img>
      <div className='flipper-back'></div>
    </div>
  </>

}