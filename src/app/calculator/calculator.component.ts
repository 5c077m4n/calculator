import { Component, OnInit } from '@angular/core';

const OPERATORS = {'+': 1, '-': 1, '*': 2, '/': 2, '%': 2};
const ERROR_MESSAGE = '///// ERROR /////';

@Component({
	selector: 'app-calculator',
	templateUrl: './calculator.component.html',
	styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent implements OnInit {
	input: string = '';

	constructor() {}
	ngOnInit() {}

	// Helper functions for calculations
	isOperator(char: string): boolean {
		return (char in OPERATORS);
	}
	isDigit(digit: string): boolean {
		if(typeof digit === 'string') return ((digit >= '0') && (digit <= '9'));
		if(typeof digit === 'number') return ((digit >= 0) && (digit <= 9));
		return false;
	}
	isNumeric(num: any): boolean {
		return (!isNaN(+num) && isFinite(num));
	}
	peek(arr: any[]): any {
		return arr[arr.length - 1];
	}
	// Convert a string into number[]
	strToArr(expression: string): any[] {
		let decFrac = 0, negExp = 0;
		return expression
			.split('')
			.reduce((arrOut: any[], char) => {
				if(this.isDigit(char)) {
					if(!decFrac)
					{
						arrOut[arrOut.length-1] *= 10;
						arrOut[arrOut.length-1] += (+char);
					}
					else {
						negExp += 1;
						arrOut[arrOut.length-1] *= Math.pow(10, negExp);
						arrOut[arrOut.length-1] += (+char);
						arrOut[arrOut.length-1] /= Math.pow(10, negExp);
					}
				}
				if(char === '.') decFrac = 1;
				if(this.isOperator(char)) {
					arrOut.push(char);
					arrOut.push(0);
					decFrac = 0;
					negExp = 0;
				}
				return arrOut;
			}, [0]
		);
	}
	// Turn number[] to Reverse Polish Notation
	toPostfix(expression: any[]): any[] {
		let stack: any[] = [];
		return expression
			.reduce((output, token) => {
				if(this.isNumeric(token)) output.push(token);
				if(token in OPERATORS) {
					while((this.peek(stack) in OPERATORS) && (OPERATORS[token] <= OPERATORS[this.peek(stack)])) output.push(stack.pop());
					stack.push(token);
				}
				if(token === '(') stack.push(token);
				if(token === ')') {
					while(this.peek(stack) !== '(') output.push(stack.pop());
					stack.pop();
				}
				return output;
			}, [])
			.concat(stack.reverse());
	};
	// Solve an RPN expression
	solvePostfix(postfixExp: any[]): Number {
		let resultStack = [], num1 = 0, num2 = 0;
		for(let i = 0; i < postfixExp.length; i++) {
			if(this.isNumeric(postfixExp[i])) resultStack.push(postfixExp[i]);
			else {
				num1 = resultStack.pop();
				num2 = resultStack.pop();
				switch(postfixExp[i]) {
					case '+':
						resultStack.push(num1 + num2);
						break;
					case '-':
						resultStack.push(num2 - num1);
						break;
					case '*':
						resultStack.push(num1 * num2);
						break;
					case '/':
						resultStack.push(num2 / num1);
						break;
					case '%':
						resultStack.push(num2 % num1);
						break;
					default:
						console.log('Unsupported opration');
						return undefined;
				}
			}
		}
		return (resultStack.length > 1)? undefined : resultStack.pop();
	}
	calculate(expression: string): Number {
		return this.solvePostfix(this.toPostfix(this.strToArr(expression)));
	}

	// Functions to edit i/o
	addToInputRow(char: any): void {
		this.input += char;
	}
	clearInputRow(): void {
		this.input = '';
	}
	onKeydown(event): void {
		if(this.isDigit(event.key) || (this.isOperator(event.key))) this.addToInputRow(event.key);
		if(event.key === 'Enter') {
			this.clearInputRow();
			this.addToInputRow(this.calculate(this.input));
		}
		if(event.key === 'Backspace') this.clearInputRow();
	}
}
