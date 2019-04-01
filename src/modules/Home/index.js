import React, { Component } from 'react';
const css = require('./index.scss');

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			row: 20,
			col: 20,
			table: [],
			snakeLen: 3,
		};
	}
	componentDidMount() {
		this.initTableData();
	}
	render() {
		return (
			<div className={css.content}>
				<div className={css.main}>
					{this.drawTable()}
				</div>
			</div>
		);
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
		this.setState({ table: table }, () => this.initSnake());
	}
	/**
	 * 初始化 一条蛇
	 */
	initSnake = () => {
		let { snakeLen, table } = this.state;
		for (let i = 0; i < snakeLen; i++) {
			table[0][i] = 'snake';
		}
		this.setState({ table: table }, () => this.creatEgg());
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
		this.setState({ table: table });
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
}

export default App;
