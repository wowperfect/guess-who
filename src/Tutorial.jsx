import React, {useRef} from "react";

export default function Tutorial () {
  const dialogRef = useRef(null)

  return <>
    <button
      onClick={() => dialogRef.current?.showModal()}
      style={{
        borderRadius: '999px',
        fontWeight: 'bolder',
      }}>?</button>
    <dialog ref={dialogRef} className="candy-card">
      <div>
        <form method="dialog" className="close">
          <button style={{ float: 'right', borderRadius: '999px' }} className="candy-texture-paper">
            ✖️
          </button>
        </form>
        <h3>welcome to <b>subjective guess who</b>!</h3>
        <p>
          this is a two player game where your aim is to ask
          silly questions to guess your opponent's character.
        </p>
        <p>
          to play, simply:
        </p>
        <ul>
          <li>
            have a friend
          </li>
          <li>
            send them the url of your board
          </li>
          <li>
            have fun!
          </li>
        </ul>
        <br/>
        <form method="dialog">
          <button style={{float: 'right'}} className="candy-primary">okay</button>
        </form>
      </div>
    </dialog>
  </>

}