import Image from 'next/image';

import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext } from '../../contexts/PlayerContexts';
import styles from './styles.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const { episodeList,
    currentEpisodeIndex,
    isPlaying,
    tooglePlay,
    playNext,
    playPrevious,
    setIsPlayingState
  } = useContext(PlayerContext);
  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount)
  }
  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora" />
        <strong>Tocando Agora {episode?.title}</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <strong>{episode.members}</strong>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um posdcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                onChange={handSeek}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button type="button" disabled={!episode}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode}
            onClick={tooglePlay}>
            {isPlaying
              ? <img src="/pause.svg" alt="Tocar" />
              : <img src="/play.svg" alt="Tocar" />}
          </button>
          <button type="button" disabled={!episode} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>,
          <button type="button" disabled={!episode}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>

  );
}