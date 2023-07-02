export const KDAWG_USER_ID = '221785400';
export const FATED_USER_ID = '184426448';
export const ZULII_USER_ID = '238086975';

export const JOIN_COMMANDS = ['!join', '!play'];

export const ROOT_HTML_TEMPLATE = `
	<div id="timer_container">
		<h1 id="lotter_timer_title">Chat Lottery</h1>
		<div id="running_lottery">
			<canvas id="timer" height="200" width="200"></canvas>
			<h2 id="users_in_pool">Users in pool: <span id="lottery_players_count">0</span></h2>
			<h2>Type !play or !join to be included in the lottery!</h2>
		</div>
		<div id="lottery_results">
			<h2>Winners:</h2>
			<ul id="lottery_winners_container"></ul>
		</div>
	</div>
`;

export const PAGE_CSS = `
	html, body {
		margin: 0px;
		position: relative;
		font-family: 'Fredoka', sans-serif;
	}
	.invisible {
		opacity: 0;
		transition: opacity 1s;
	}
	.visible {
		opacity: 1;
		transition: opacity 1s;
	}
	
	#timer_container {
		position: absolute;
		opacity: 0;
		transition: opacity 1s, top 1s ease;
		right: 10px;
		top: 10px;
		width: min-content;
		text-align: center;
		background-color: #3F3F3F;
		color: white;
		padding: 0px 38px;
		border-radius: 4px;
		height: 670px;
	}

	#timer_container h1 {
		font-size: 64px;
		white-space: nowrap;
	}

	#timer_container h2 {
		font-size: 42px;
	}

	#users_in_pool {
		white-space: nowrap;
	}

	#running_lottery, #lottery_results {
		transition: opacity 1s;
	}
	#lottery_results {
		opacity: 0;
		transform: translateY(-330px);
		float: left;
		padding-left: 10px;
	}
	#lottery_winners_container li {
		font-size: 40px;
	}
`;
