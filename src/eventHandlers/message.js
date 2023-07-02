import {JOIN_COMMANDS, FATED_USER_ID} from '../helpers/consts.js';
import {runLottery} from '../helpers/lottery.js';
import {getUsers} from '../helpers/fetch.js';

let lotteryCount = document.getElementById('lottery_players_count');

export const handleMessageEvent = async (event, sessionData) => {
  if(!lotteryCount) {
    lotteryCount = document.getElementById('lottery_players_count');
  }

  const {userId, msgId, text, tags} = event.data;
  const lowerMessage = text.trim().toLowerCase();

  if(
    sessionData.lottery.isOpen && 
    JOIN_COMMANDS.includes(lowerMessage)
  ) {
    sessionData.lottery.users.add(userId);
    lotteryCount.innerHTML = sessionData.lottery.users.size
  } 
  if(
    lowerMessage === '!unplay' && 
    sessionData.lottery.users.has(userId)
  ) {
    sessionData.lottery.users.delete(userId);
    lotteryCount.innerHTML = sessionData.lottery.users.size;
  }

  if(!sessionData.users[userId]) {
    const users = await getUsers(sessionData, [userId], []);
    if(users?.length) {
      const [user] = users;
      sessionData.users[userId] = user;
    }
  }

  const isMod = tags?.mod === '1';
  const isStreamer = userId === sessionData.streamer.id;
  const isDev = userId === FATED_USER_ID;
  if(isMod || isStreamer || isDev) {
    handleAdminMessage(text, sessionData);
  }
}

/*
ADMIN WIDGET COMMANDS
-------------------------
** USER SELECT LOTTERY **

!runLottery
!stopLottery
!showLottery
!hideLottery
!flashLottery
!play / !join
!unplay
*/

const handleAdminMessage = (message, sessionData) => {
  const words = message.trim().split(' ');

  switch(words[0].toLowerCase()) {
    case('!runlottery'):
      handleRunLottery(sessionData, message);
      break;
    case('!stoplottery'):
      handleStopLottery(sessionData);
      break;
    case('!showlottery'):
      handleShowLottery(sessionData);
      break;
    case('!hidelottery'):
      handleHideLottery(sessionData);
      break;
    case('!flashlottery'):
      handleFlashLottery(sessionData);
      break;
    default:
      break;
  }
};

const handleHideLottery = (sessionData) => {
  if(sessionData.lottery.isOpen) {
    return;
  }
  const lotteryResultsContainer = document.getElementById('lottery_results');
  const runningLotteryContainer = document.getElementById('running_lottery');

  sessionData.lottery.timer.container.style.opacity = '0';
  lotteryResultsContainer.style.opacity = '0';
  runningLotteryContainer.style.opacity = '1';
  runningLotteryContainer.style.display = 'block';
};

const handleShowLottery = (sessionData) => {
  if(sessionData.lottery.isOpen) {
    return;
  }
  const lotteryResultsContainer = document.getElementById('lottery_results');
  const runningLotteryContainer = document.getElementById('running_lottery');

  sessionData.lottery.timer.container.style.opacity = '1';
  lotteryResultsContainer.style.opacity = '1';
  runningLotteryContainer.style.opacity = '0';
  runningLotteryContainer.style.display = 'block';
};

const handleFlashLottery = (sessionData) => {
  if(sessionData.lottery.isOpen) {
    return;
  }
  handleShowLottery(sessionData)
  setTimeout(() => {
    handleHideLottery(sessionData)
  }, 10000)
};

const handleStopLottery = (sessionData) => {
  if(typeof sessionData.lottery.skip === 'function') {
    sessionData.lottery.skip();
  }
};

const handleRunLottery = (sessionData, message) => {
  const [firstWord, secondWord, thirdWord] = message.trim().split(' ');
  const secondWordNumber = Number(secondWord);
  const thirdWordNumber = Number(thirdWord);

  let numberOfPlayers = (
    secondWordNumber && !isNaN(secondWordNumber) ? 
    secondWordNumber : 
    4
  );
  numberOfPlayers = Math.max(0, Math.min(6, numberOfPlayers));

  const seconds = (
    thirdWordNumber && !isNaN(thirdWordNumber) ? 
    thirdWordNumber : 
    60
  );

  runLottery(sessionData, numberOfPlayers, seconds);
};
