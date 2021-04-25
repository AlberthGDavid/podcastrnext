import { createContext, useState, ReactNode } from 'react';
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}
type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  tooglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setIsPlayingState: (state: boolean) => void;
}
export const PlayerContext = createContext({} as PlayerContextData);
type PlayerContextProviderProps = {
  children: ReactNode;
}
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false)
  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function tooglePlay() {
    setIsPlaying(!isPlaying);
  }

  function setIsPlayingState(state: boolean) {
    setIsPlaying(state);
  }
  function playNext() {
    const nextEpisodeIndex = currentEpisodeIndex + 1;
    if (nextEpisodeIndex < episodeList.length) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        play,
        isPlaying,
        playNext,
        playPrevious,
        tooglePlay,
        setIsPlayingState,
        playList,
      }}>
      {children}
    </PlayerContext.Provider>
  )
}