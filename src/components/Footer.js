import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__para">
        <span className="bold">HOW TO PLAY:</span> Use your{' '}
        <span className="bold">arrow keys</span> to move the tiles. When two tiles with
        the same number touch, they <span className="bold">merge into one!</span>
      </p>

      <hr className="footer__hr" />

      <p className="footer__para">
        This game was created by{' '}
        <a
          href="http://gabrielecirulli.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="link bold"
        >
          Gabriele Cirulli
        </a>{' '}
        — original game{' '}
        <a
          href="http://git.io/2048"
          target="_blank"
          rel="noopener noreferrer"
          className="link bold"
        >
          website.
        </a>{' '}
        I've just cloned the game for fun and testing my code skills.
      </p>

      <hr className="footer__hr" />

      <div className="footer__links">
        <a
          href="https://github.com/zronev/2048-clone"
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          Repo
        </a>
        <a
          href="https://github.com/zronev"
          target="_blank"
          rel="noopener noreferrer"
          className="button"
        >
          Github profile
        </a>
      </div>
    </footer>
  )
}

export default Footer
