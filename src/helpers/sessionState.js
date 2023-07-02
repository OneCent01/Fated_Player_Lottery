export const initLotteryData = () => {
  const lotteryState = {
    isOpen: false,
    winnersCount: 0,
    users: new Set(),
    winners: [],
    timer: {
      container: null,
      canvas: null,
    },
    skip: null,
  };

  const timerContainer = document.getElementById('timer_container')
  const timerCanvas = document.getElementById('timer');
  lotteryState.timer = {
    container: timerContainer,
    canvas: timerCanvas,
  }

  return lotteryState;
};

export const initSessionData = () => {
  const state = {
    streamer: {
      id: null,
      username: null,
      token: null,
    },
    users: {},
    lottery: initLotteryData(),
  };

  return state;
};
