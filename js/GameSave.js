window.GameSave = (() => {
  const SAVE_KEY = "myGameSave";
  let currentSave = null;  // internal memory cache

  function defaultSave() {
    return {
      version: 1,
      timestamp: Date.now(),
      state: {
        tutorialdone: false,
        money: 0,
        highestMission: 0,
        hacksCompleted: [],
        shopItemsBought: [],
        circuitBreakersCompleted: []
      }
    };
  }

  function saveGame() {
    if (currentSave) {
      currentSave.timestamp = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(currentSave));
    }
  }

  function loadGame() {
    if (!currentSave) {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) {
        currentSave = defaultSave();
      } else {
        currentSave = JSON.parse(raw);
        currentSave = migrateSave(currentSave);
      }
    }
    return currentSave;
  }

  //still on version 1.0 so nothing to migrate
  function migrateSave(save) {
    switch(save.version) {
      default: break;
    }
    return save;
  }

    function resetProgress() {
    localStorage.removeItem(SAVE_KEY);
    currentSave = defaultSave();
    saveGame();
  }


  loadGame();
  saveGame();

  return {
    load: loadGame,
    save: saveGame,
    resetProgress,
    get state() {
      loadGame();      // ensure it's loaded
      return currentSave.state;
    }
  };
})();

