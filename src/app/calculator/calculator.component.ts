import { Component, OnInit, HostListener } from '@angular/core';

const OPERATORS = {'+': 1, '-': 1, '*': 2, '/': 2, '%': 2};
const ERROR_MESSAGE = '///// ERROR /////';

@Component({
	selector: 'app-calculator',
	templateUrl: './calculator.component.html',
	styleUrls: ['./calculator.component.scss']
})

export class CalculatorComponent implements OnInit {
	input: string;

	constructor() {}
	ngOnInit() {
		this.clearInputRow();
	}
	@HostListener('document:keypress', ['$event']) handleKeyboardEvent(event: KeyboardEvent): void {
		if(this.isDigit(event.key) || (this.isOperator(event.key)) || event.key === '.')
			return this.addToInputRow(event.key);
		if(event.key === 'Enter' || event.key === '=') return this.showAnswer();
		if(event.key === 'Backspace' || event.key === 'Delete') return this.clearInputRow();
		return;
	}

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
	// Convert a string into <any[]>
	strToArr(expression: string): any[] {
		let decFrac: boolean = false, negExp: number = 0;
		let result = expression
			.split('')
			.reduce((arrOut: any[], char: any): any[] => {
				if(this.isDigit(char)) {
					if(!decFrac) {
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
				if(char === '.' && !decFrac) decFrac = true;
				if(this.isOperator(char)) {
					arrOut.push(char);
					arrOut.push(0);
					decFrac = false;
					negExp = 0;
				}
				return arrOut;
			}, [0]);
		return result;
	}
	// Turn <any[]> to Reverse Polish Notation
	toPostfix(expression: any[]): any[] {
		let stack: any[] = [];
		return expression
			.reduce((arrOut, token) => {
				if(this.isNumeric(token)) arrOut.push(token);
				if(token in OPERATORS) {
					while((this.peek(stack) in OPERATORS) && (OPERATORS[token] <= OPERATORS[this.peek(stack)]))
						arrOut.push(stack.pop());
					stack.push(token);
				}
				// if(token === '(') stack.push(token);
				// if(token === ')') {
				// 	while(this.peek(stack) !== '(') arrOut.push(stack.pop());
				// 	stack.pop();
				// }
				return arrOut;
			}, [])
			.concat(stack.reverse());
	};
	// Solve an RPN expression
	solvePostfix(postfixExp: any[]): number {
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
						this.showError();
						return undefined;
				}
			}
		}
		return (resultStack.length > 1)? undefined : resultStack.pop();
	}
	calculate(expression: string): number {
		return this.solvePostfix(this.toPostfix(this.strToArr(expression)));
	}

	// Functions to edit input row
	clearInputRow(): void {
		this.input = '';
	}
	addToInputRow(char: any): void {
		if(this.input === ERROR_MESSAGE) this.clearInputRow();
		this.input += char;
	}
	showError(): void {
		const that = this;
		this.clearInputRow();
		this.addToInputRow(ERROR_MESSAGE);
		setTimeout(text => that.input = text, 1500, '');
	}
	showAnswer(): void {
		const result = this.calculate(this.input);
		this.clearInputRow();
		if(this.isNumeric(result)) return this.addToInputRow(result);
		return this.showError();
	}
}
