import { Component } from '@angular/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
  display: string = '0';
  previousValue: string = '';
  operation: string = '';
  waitingForNewNumber: boolean = false;
  hasDecimal: boolean = false;

  constructor() { }

  // Handle number input
  inputNumber(num: string): void {
    if (this.waitingForNewNumber) {
      this.display = num;
      this.waitingForNewNumber = false;
      this.hasDecimal = num === '.';
    } else {
      if (num === '.' && this.hasDecimal) {
        return; // Don't allow multiple decimals
      }
      if (num === '.' && !this.hasDecimal) {
        this.hasDecimal = true;
      }
      this.display = this.display === '0' ? num : this.display + num;
    }
  }

  // Handle operation input (+, -, *, /)
  inputOperation(op: string): void {
    if (this.previousValue !== '' && this.operation !== '' && !this.waitingForNewNumber) {
      this.calculate();
    }
    this.previousValue = this.display;
    this.operation = op;
    this.waitingForNewNumber = true;
    this.hasDecimal = false;
  }

  // Perform calculation
  calculate(): void {
    if (this.previousValue === '' || this.operation === '') {
      return;
    }

    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.display);
    let result = 0;

    switch (this.operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '*':
        result = prev * current;
        break;
      case '/':
        if (current === 0) {
          this.display = 'Error';
          this.clear();
          return;
        }
        result = prev / current;
        break;
      default:
        return;
    }

    // Handle decimal places and large numbers
    const resultString = result.toString();
    if (resultString.length > 12) {
      if (result.toString().includes('e')) {
        this.display = result.toExponential(6);
      } else {
        this.display = result.toFixed(8).replace(/\.?0+$/, '');
      }
    } else {
      this.display = resultString;
    }

    this.previousValue = '';
    this.operation = '';
    this.waitingForNewNumber = true;
    this.hasDecimal = this.display.includes('.');
  }

  // Clear display and reset calculator
  clear(): void {
    this.display = '0';
    this.previousValue = '';
    this.operation = '';
    this.waitingForNewNumber = false;
    this.hasDecimal = false;
  }

  // Clear current entry only
  clearEntry(): void {
    this.display = '0';
    this.hasDecimal = false;
  }

  // Delete last digit
  delete(): void {
    if (this.display.length > 1) {
      if (this.display.charAt(this.display.length - 1) === '.') {
        this.hasDecimal = false;
      }
      this.display = this.display.slice(0, -1);
    } else {
      this.display = '0';
      this.hasDecimal = false;
    }
  }

  // Toggle positive/negative
  toggleSign(): void {
    if (this.display !== '0') {
      if (this.display.charAt(0) === '-') {
        this.display = this.display.slice(1);
      } else {
        this.display = '-' + this.display;
      }
    }
  }

  // Calculate percentage
  percentage(): void {
    const current = parseFloat(this.display);
    this.display = (current / 100).toString();
    this.hasDecimal = this.display.includes('.');
  }
}
