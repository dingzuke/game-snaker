import React, { Component } from 'react';
import { notification, Icon, Tooltip } from 'antd';
const css = require('./index.scss');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			row: 20, // 行数
			col: 20, // 列数
			table: [], // 网格 二维数组
			egg: [undefined, undefined], // 蛋蛋坐标 
			snakeLen: 3, // 初始化 蛇长度
			snakeBody: [], // 蛇身体 二维数组
			direction: 'right', // 蛇移动方向: right(默认右) left(左) down(下) up(上)
			upDateTime: 400, // 更新时间,
			timerFun: undefined, // 定时器
			gameState: 'play' // 游戏状态 play:开始  pause: 暂停
		};
	}
	componentDidMount() {
		this.initTableData();
	}
	render() {
		let { gameState } = this.state;
		return (
			<div className={css.content}>
				<div className={css.direction}>
					<div>键盘操作说明: ↑ ↓ ← →</div>
					{
						gameState === 'pause' && 
						<Tooltip placement="top" title={'继续'}>
							<Icon type="play-circle" className={css.iconBt} onClick={() => this.play()}/>
						</Tooltip>
					}
					{
						gameState === 'play' && 
						<Tooltip placement="top" title={'暂停'}>
							<Icon type="pause-circle" className={css.iconBt} onClick={() => this.pause()}/>
						</Tooltip>
					}
					{
						gameState === 'over' &&
						<Tooltip placement="top" title={'重来'}>
							<Icon type="redo" className={css.iconBt} onClick={() => this.initTableData()} />
						</Tooltip>
					}
				</div>
				<div className={css.main}>
					{this.drawTable()}
				</div>
			</div>
		);
	}
	/**
	 * 开始
	 */
	play = () => {
		let { gameState } = this.state;
		gameState = 'play';
		this.setState({ gameState });
		this.startTime();
	}
	/**
	 * 暂停
	 */
	pause = () => {
		let { gameState } = this.state;
		gameState = 'pause';
		this.setState({ gameState });
		this.clearEven();
	}
	/** 
	 * 根据行列 初始化data 
	 */
	initTableData = () => {
		let { row, col } = this.state;
		let table = [];
		for (let i = 0; i < row; i++) {
			table.push([]);
			for (let k = 0; k < col; k++) {
				table[i].push(0);
			}
		}
		this.setState({ table: table, direction: 'right', gameState: 'play' }, () => this.initSnake());
	}
	/**
	 * 初始化 一条蛇
	 */
	initSnake = () => {
		let { snakeLen, table, snakeBody } = this.state;
		snakeBody = [];
		for (let i = 0; i < snakeLen; i++) {
			table[0][i] = 'snake';
			snakeBody.push([0, i]);
		}
		this.setState({ 
			table: table,
			snakeBody: snakeBody,
		 }, () => {
			this.creatEgg();
			this.startTime();
		 });
	}
	/**
	 * 定时器 启动
	 */
	startTime = () => {
		let { upDateTime, timerFun } = this.state;
		timerFun = setInterval(() => {
			this.move();
		}, upDateTime);
		this.setState({ timerFun }, () => this.listenerKey());
	}
	/**
	 * 清除相关事件
	 */
	clearEven = () => {
		let { timerFun } = this.state;
		// 清除定时器
		clearInterval(timerFun);
		// 清除键盘监听
		document.removeEventListener('keyup', this.keyUpEvent, false);
	}
	/**
	 * 添加键盘监听
	 */
	listenerKey = () => {
		document.addEventListener('keyup', this.keyUpEvent, false);
	}
	/**
	 * 产生一个合格的蛋蛋egg
	 */
	creatEgg = () => {
		let { table } = this.state;
		let eggArr = this.getAvailableEggRC();
		let egg = eggArr[Math.floor(Math.random() * eggArr.length)];

		if (!Array.isArray(egg) || !egg.length) {
			return false;
		}
		table[egg[0]][egg[1]] = 'egg';
		this.setState({ table: table, egg });
	}
	/**
	 * 获取可以生成蛋蛋的所有有效坐标集(Row,Col)
	 */
	getAvailableEggRC = () => {
		let eggArr = [];
		let { row, col, table } = this.state;
		for (let y = 0; y < row; y++) {
			for (let x = 0; x < col; x++) {
				if (table[y][x] === 0) {
					eggArr.push([y, x]);
				}
			}
		}
		return eggArr;
	}
	/**
	 * 绘制网格
	 */
	drawTable = () => {
		let table = this.state.table;
		if (!Array.isArray(table)) {
			return null;
		}
		let temp =  table.map((data, index) => {
			return (<div key={index} className={css.row}>{this.getCol(data, index)}</div>);
		});
		return temp;
	}

	/**
	 * 绘制单个小方格
	 */
	getCol = (col, rowInex) => {
		if (!Array.isArray(col)) {
			return null;
		}
		return col.map((item) => {
			let className;
			switch (item) {
				case 'egg':
					className = css.egg;
					break;
				case 'snake':
					className = css.snake;
					break;
				default:
					className = css.col;
					break;
			}
			return (<div key={Math.random()} className={className}></div>);
		});
	}
	/**
	 * 蛇移动
	 */
	move = () => {
		let { direction, snakeBody, table, egg, snakeLen } = this.state;
		let head = JSON.parse(JSON.stringify(snakeBody[snakeBody.length - 1])); 
		switch (direction) {
			case 'right':
				head[1] = head[1] + 1;
				break;
			case 'left':
				head[1] = head[1] - 1;
				break;
			case 'down':
				head[0] = head[0] + 1;
				break;
			case 'up':
				head[0] = head[0] - 1;
				break;
			default:
				break;
		}
		// 撞墙判断
		if (!this.collisionWall(head)) {
			notification['warning']({
				message: '瓜皮, 撞墙了你晓得不!',
				description: `得分: ${snakeBody.length - snakeLen}`,
			});
			this.clearEven();
			this.setState({ gameState: 'over' });
			return false;
		} 
		// 咬自己身体
		if (!this.eatYourBody(head)) {
			notification['warning']({
				message: '哈麻皮,你咬到你国人了!',
				description: `得分: ${snakeBody.length - snakeLen}`,
			});
			this.clearEven();
			this.setState({ gameState: 'over' });
			return false;
		} 
		// 是否吃着了蛋蛋
		let isEatEgg = JSON.stringify(egg) === JSON.stringify(head);

		snakeBody.push(head);
		table[head[0]][head[1]] = 'snake';
		table[snakeBody[0][0]][snakeBody[0][1]] = 0;
		if (isEatEgg) {
			this.creatEgg();
		}
		snakeBody.splice(0, isEatEgg ? 0 : 1);
		this.setState({
			snakeBody,
			table,
		});
	}
	/**
	 * 咬着自己身体
	 */
	eatYourBody = (head) => {
		let { snakeBody } = this.state;
		let state = true;
		snakeBody.forEach((itme) => {
			if (JSON.stringify(itme) === JSON.stringify(head)) {
				state = false;
			}
		});
		return state;
	}
	/**
	 * 碰壁判断
	 */
	collisionWall = (head) => {
		let headRow =  head[0];
		let headCol = head[1];
		let { row, col } = this.state;
		if (headRow < 0 || headCol < 0) {		
			return false;
		}
		if (headRow >= row || headCol >= col) {
			return false;
		}
		return true;
	}
	keyUpEvent = (e) => {
		let { direction } = this.state;
		// right(默认右) left(左) down(下) up(上)
		switch (e.keyCode) {
			case 38:
				if (direction !== 'down') {
					direction = 'up';
				}
				break;
			case 40:
				if (direction !== 'up') {
					direction = 'down';
				}
				break;
			case 37:
				if (direction !== 'right') {
					direction = 'left';
				}
				break;
			case 39:
				if (direction !== 'left') {
					direction = 'right';
				}
				break;
			default:
				break;
		}
		this.setState({ direction });
	}
}

export default App;
