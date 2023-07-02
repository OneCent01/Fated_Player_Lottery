import {runTimer} from './timer.js';
import {initLotteryData} from './sessionState.js';
import {STREAMER} from './consts.js';

const timerPromise = (sessionData, seconds) => new Promise((resolve) => {
	runTimer(sessionData, {
		seconds, 
		onComplete: resolve,
		canvas: sessionData.lottery.timer.canvas
	});
});

let hideTimeout = null;

export const runLottery = async (sessionData, numberOfPlayers, seconds) => new Promise(async (resolve) => {
	console.log('sessionData: ', sessionData)
	const runningLotteryContainer = document.getElementById('running_lottery');
	const lotteryResultsContainer = document.getElementById('lottery_results');
	const lotterResultsList = document.getElementById('lottery_winners_container');
	const lotteryCount = document.getElementById('lottery_players_count');

	let isSkipped = false;
	sessionData.lottery = initLotteryData();
	sessionData.lottery.timer.container.style.opacity = '1';
	
	sessionData.lottery.skip = () => {
		runningLotteryContainer.style.opacity = '0';
		lotteryResultsContainer.style.opacity = '0';
		sessionData.lottery.timer.container.style.opacity = '0';
		isSkipped = true;
		sessionData.lottery = initLotteryData();
		lotteryCount.innerHTML = sessionData.lottery.users.size;
		resolve();
		return;
	}

	lotteryResultsContainer.style.opacity = '0';
	runningLotteryContainer.style.display = 'block';
	runningLotteryContainer.style.opacity = '1';

	sessionData.lottery.isOpen = true;

	let isDone = false;

	while(!isDone) {
		await timerPromise(sessionData, seconds);
		if(sessionData.lottery.users.size >= numberOfPlayers) {
			isDone = true;
		}
		if(isSkipped) {
			resolve();
			return;
		}
	};

	while(sessionData.lottery.winners.length < numberOfPlayers) {
		const randomUserIndex = Math.floor(Math.random() * sessionData.lottery.users.size);
		const usersArray = [...sessionData.lottery.users];
		const selectedUser = usersArray[randomUserIndex];
		sessionData.lottery.users.delete(selectedUser);
		sessionData.lottery.winners.push(selectedUser);
	}

	while(lotterResultsList.firstChild) {
		lotterResultsList.removeChild(lotterResultsList.firstChild);
	}

	sessionData.lottery.winners.forEach(winnerId => {
		const winner = sessionData.users[winnerId];
		const liElem = document.createElement('li')
		liElem.innerHTML = winner?.display_name;
		lotterResultsList.appendChild(liElem)
	})

	runningLotteryContainer.style.opacity = '0';
	lotteryResultsContainer.style.opacity = '1';

	hideTimeout = setTimeout(() => {
		if(isSkipped) {
			resolve();
			return;
		}
		sessionData.lottery.timer.container.style.opacity = '0';
		sessionData.lottery.isOpen = false;
		sessionData.lottery.skip = null;
		resolve();
	}, 20000);
});