import { useEffect, useState } from 'react';
import './App.css';

// Components
import CardPortal from './components/CardPortal/CardPortal';
import CardPortalSkeleton from './components/CardPortal/CardPortal.skeleton';

// Constants
const JPN = 'jpn';
const LOCALE_DOMAIN = {
  [JPN]: 'https://jpn.dbz-dokkanbattle.com',
};
const BANNED_PORTALS = ['不思議な儀式ガシャ'];

const browserApi = (typeof browser !== 'undefined') ? browser : chrome;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [gashas, setGashas] = useState([]);

  /**
   * Filters an array of gashas based on the given name.
   *
   * @param {Array} array - The array of gashas to filter.
   * @param {string} name - The name to check against each gasha's name.
   * @returns {Array} - The filtered array of gashas.
   */
  const filteredGashas = (array, name) => array.filter((gasha) => !name.includes(gasha.name));

  /**
   * Get the latest gashas from the given array.
   *
   * @param {Array} array - The array of gashas.
   * @param {number} nb - The number of gashas to return.
   * @returns {Array} - The latest gashas.
   */
  const getLastestGashas = (array, nb) => {
    const filtered = filteredGashas(array, BANNED_PORTALS);
    return filtered.slice(0, nb);
  };

  /**
   * Handles the tab link by creating a new tab with the specified URL.
   *
   * @param {string} id - The ID of the tab.
   */
  const handleTabLink = (id) => {
    browserApi.tabs.create({ active: true, url: `${LOCALE_DOMAIN[JPN]}/summon/${id}` });
  };

  useEffect(() => {
    setGashas([]);
    setIsLoading(true);

    fetch(`${LOCALE_DOMAIN[JPN]}/api/gashas/Gasha::StoneGasha`)
      .then((response) => response.json())
      .then((data) => {
        const activeGashas = getLastestGashas(data, 6);
        setGashas(activeGashas);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <div className="locale-space" />
        <h1 className="title">Dokkan Battle Summons</h1>
        <div className="locale-space" />
      </header>
      <main className="main">
        {gashas?.length > 0 || !isLoading
          ? gashas.map((gasha) => (
            <CardPortal
              key={gasha.id}
              gasha={gasha}
              handleTabLink={handleTabLink}
              backgroundUrl={`${LOCALE_DOMAIN[JPN]}/img/gashas/gashas_`}
            />
          )) : (
            Array.from({ length: 6 }).map((_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <CardPortalSkeleton key={index} />
            ))
          )}
      </main>
    </div>
  );
}

export default App;
