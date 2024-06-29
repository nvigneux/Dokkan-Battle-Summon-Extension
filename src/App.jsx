import { useEffect, useState } from 'react';
import './App.css';

// Components
import CardPortal from './components/CardPortal/CardPortal';
import CardPortalSkeleton from './components/CardPortal/CardPortal.skeleton';

// Constants
const GLO = 'global';
const JPN = 'jpn';
const LOCALE_DOMAIN = {
  [GLO]: 'https://dbz-dokkanbattle.com',
  [JPN]: 'https://jpn.dbz-dokkanbattle.com',
};
const BANNED_PORTALS = ['Invocation "Rituel mystérieux"', '不思議な儀式ガシャ'];

const browserApi = (typeof browser !== 'undefined') ? browser : chrome;

function App() {
  const [locale, setLocale] = useState(GLO);

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
    browserApi.tabs.create({ active: true, url: `${LOCALE_DOMAIN[locale]}/summon/${id}` });
  };

  /**
   * Handles the locale change.
   */
  const handleLocale = () => {
    setLocale((prevLocale) => (prevLocale === GLO ? JPN : GLO));
  };

  useEffect(() => {
    setGashas([]);
    setIsLoading(true);

    fetch(`${LOCALE_DOMAIN[locale]}/api/gashas/Gasha::StoneGasha`)
      .then((response) => response.json())
      .then((data) => {
        const activeGashas = getLastestGashas(data, 6);
        setGashas(activeGashas);
        setIsLoading(false);
      });
  }, [locale]);

  return (
    <div className="app">
      <header className="header">
        <div className="locale-space" />
        <h1 className="title">Dokkan Battle Summons</h1>
        <button
          type="button"
          onClick={handleLocale}
          className="locale-btn"
          title={
            locale === GLO
              ? 'Switch to the Japanese version'
              : 'Switch to the Global version'
          }
        >
          {locale === GLO
            ? <img src="assets/global-flag.webp" alt="Global flag" className={`flag-${locale}`} />
            : <img src="assets/jpn-flag.webp" alt="Japan flag" className={`flag-${locale}`} />}
        </button>
      </header>
      <main className="main">
        {gashas?.length > 0 || !isLoading
          ? gashas.map((gasha) => (
            <CardPortal
              key={gasha.id}
              gasha={gasha}
              handleTabLink={handleTabLink}
              backgroundUrl={`${LOCALE_DOMAIN[locale]}/img/gashas/gashas_`}
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
