import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.display).toBe('0');
      expect(component.previousValue).toBe('');
      expect(component.operation).toBe('');
      expect(component.waitingForNewNumber).toBe(false);
      expect(component.hasDecimal).toBe(false);
    });
  });

  describe('Number Input', () => {
    it('should input single numbers correctly', () => {
      component.inputNumber('5');
      expect(component.display).toBe('5');
    });

    it('should input multiple numbers correctly', () => {
      component.inputNumber('5');
      component.inputNumber('3');
      component.inputNumber('7');
      expect(component.display).toBe('537');
    });

    it('should replace display when waiting for new number', () => {
      component.waitingForNewNumber = true;
      component.inputNumber('9');
      expect(component.display).toBe('9');
      expect(component.waitingForNewNumber).toBe(false);
    });

    it('should handle zero input when display is zero', () => {
      component.display = '0';
      component.inputNumber('0');
      expect(component.display).toBe('0');
    });

    it('should replace zero with new number', () => {
      component.display = '0';
      component.inputNumber('5');
      expect(component.display).toBe('5');
    });
  });

  describe('Decimal Input', () => {
    it('should handle decimal input correctly', () => {
      component.inputNumber('5');
      component.inputNumber('.');
      component.inputNumber('5');
      expect(component.display).toBe('5.5');
      expect(component.hasDecimal).toBe(true);
    });

    it('should prevent multiple decimals in same number', () => {
      component.inputNumber('5');
      component.inputNumber('.');
      component.inputNumber('5');
      component.inputNumber('.');
      expect(component.display).toBe('5.5');
    });

    it('should allow decimal as first input', () => {
      component.inputNumber('.');
      expect(component.display).toBe('.');
      expect(component.hasDecimal).toBe(true);
    });

    it('should handle decimal when waiting for new number', () => {
      component.waitingForNewNumber = true;
      component.inputNumber('.');
      expect(component.display).toBe('.');
      expect(component.hasDecimal).toBe(true);
      expect(component.waitingForNewNumber).toBe(false);
    });

    it('should not allow decimal when hasDecimal is true and waiting for new number', () => {
      component.waitingForNewNumber = true;
      component.hasDecimal = true;
      component.inputNumber('.');
      expect(component.display).toBe('.');
    });
  });

  describe('Basic Operations', () => {
    it('should perform addition correctly', () => {
      component.inputNumber('5');
      component.inputOperation('+');
      component.inputNumber('3');
      component.calculate();
      expect(component.display).toBe('8');
    });

    it('should perform subtraction correctly', () => {
      component.inputNumber('10');
      component.inputOperation('-');
      component.inputNumber('3');
      component.calculate();
      expect(component.display).toBe('7');
    });

    it('should perform multiplication correctly', () => {
      component.inputNumber('5');
      component.inputOperation('*');
      component.inputNumber('4');
      component.calculate();
      expect(component.display).toBe('20');
    });

    it('should perform division correctly', () => {
      component.inputNumber('15');
      component.inputOperation('/');
      component.inputNumber('3');
      component.calculate();
      expect(component.display).toBe('5');
    });

    it('should handle decimal results', () => {
      component.inputNumber('10');
      component.inputOperation('/');
      component.inputNumber('3');
      component.calculate();
      expect(component.display).toBe('3.3333333333333335');
    });
  });

  describe('Operation Chaining', () => {
    it('should perform chained operations', () => {
      component.inputNumber('5');
      component.inputOperation('+');
      component.inputNumber('3');
      component.inputOperation('*');
      expect(component.display).toBe('8');
      component.inputNumber('2');
      component.calculate();
      expect(component.display).toBe('16');
    });

    it('should not calculate when no previous operation exists', () => {
      component.inputNumber('5');
      component.inputOperation('+');
      component.inputOperation('*');
      expect(component.previousValue).toBe('5');
      expect(component.operation).toBe('*');
    });
  });

  describe('Division by Zero', () => {
    it('should handle division by zero and reset calculator', () => {
      component.inputNumber('5');
      component.inputOperation('/');
      component.inputNumber('0');
      component.calculate();
      expect(component.display).toBe('Error');
      // After error, calculator should be reset
      expect(component.previousValue).toBe('');
      expect(component.operation).toBe('');
    });
  });

  describe('Large Numbers and Scientific Notation', () => {
    it('should handle large numbers with exponential notation', () => {
      // Create a very large number
      component.display = '1000000000000';
      component.inputOperation('*');
      component.display = '1000000000000';
      component.previousValue = '1000000000000';
      component.operation = '*';
      component.calculate();
      expect(component.display).toContain('e');
    });

    it('should format long decimal results', () => {
      component.inputNumber('1');
      component.inputOperation('/');
      component.inputNumber('3');
      component.calculate();
      // Should be formatted to remove trailing zeros
      expect(component.display.length).toBeLessThanOrEqual(12);
    });
  });

  describe('Clear Functions', () => {
    it('should clear display and reset all values with clear()', () => {
      component.inputNumber('5');
      component.inputOperation('+');
      component.inputNumber('3');
      component.clear();
      
      expect(component.display).toBe('0');
      expect(component.previousValue).toBe('');
      expect(component.operation).toBe('');
      expect(component.waitingForNewNumber).toBe(false);
      expect(component.hasDecimal).toBe(false);
    });

    it('should clear current entry only with clearEntry()', () => {
      component.inputNumber('5');
      component.inputOperation('+');
      component.inputNumber('3');
      component.inputNumber('.');
      component.inputNumber('5');
      component.clearEntry();
      
      expect(component.display).toBe('0');
      expect(component.hasDecimal).toBe(false);
      expect(component.previousValue).toBe('5');
      expect(component.operation).toBe('+');
    });
  });

  describe('Delete Function', () => {
    it('should delete last digit from multi-digit number', () => {
      component.inputNumber('1');
      component.inputNumber('2');
      component.inputNumber('3');
      component.delete();
      expect(component.display).toBe('12');
    });

    it('should delete decimal point and update hasDecimal flag', () => {
      component.inputNumber('5');
      component.inputNumber('.');
      component.delete();
      expect(component.display).toBe('5');
      expect(component.hasDecimal).toBe(false);
    });

    it('should set display to zero when deleting last digit', () => {
      component.inputNumber('5');
      component.delete();
      expect(component.display).toBe('0');
      expect(component.hasDecimal).toBe(false);
    });

    it('should handle deleting from single zero', () => {
      component.display = '0';
      component.delete();
      expect(component.display).toBe('0');
    });
  });

  describe('Sign Toggle', () => {
    it('should toggle positive number to negative', () => {
      component.inputNumber('5');
      component.toggleSign();
      expect(component.display).toBe('-5');
    });

    it('should toggle negative number to positive', () => {
      component.display = '-5';
      component.toggleSign();
      expect(component.display).toBe('5');
    });

    it('should not toggle sign of zero', () => {
      component.display = '0';
      component.toggleSign();
      expect(component.display).toBe('0');
    });

    it('should toggle sign of decimal numbers', () => {
      component.inputNumber('5');
      component.inputNumber('.');
      component.inputNumber('5');
      component.toggleSign();
      expect(component.display).toBe('-5.5');
    });
  });

  describe('Percentage Function', () => {
    it('should calculate percentage correctly', () => {
      component.inputNumber('5');
      component.inputNumber('0');
      component.percentage();
      expect(component.display).toBe('0.5');
      expect(component.hasDecimal).toBe(true);
    });

    it('should handle percentage of decimal numbers', () => {
      component.inputNumber('5');
      component.inputNumber('.');
      component.inputNumber('5');
      component.percentage();
      expect(component.display).toBe('0.055');
    });

    it('should handle percentage of zero', () => {
      component.display = '0';
      component.percentage();
      expect(component.display).toBe('0');
    });
  });

  describe('Calculate Edge Cases', () => {
    it('should return early when no previous value exists', () => {
      component.previousValue = '';
      component.operation = '+';
      const originalDisplay = component.display;
      component.calculate();
      expect(component.display).toBe(originalDisplay);
    });

    it('should return early when no operation exists', () => {
      component.previousValue = '5';
      component.operation = '';
      const originalDisplay = component.display;
      component.calculate();
      expect(component.display).toBe(originalDisplay);
    });

    it('should handle invalid operation', () => {
      component.previousValue = '5';
      component.operation = '%';
      component.display = '3';
      const originalDisplay = component.display;
      component.calculate();
      expect(component.display).toBe(originalDisplay);
    });
  });

  describe('UI Integration', () => {
    it('should render calculator display', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.current-value')).toBeTruthy();
    });

    it('should update display in DOM when display changes', () => {
      component.display = '123';
      fixture.detectChanges();
      const displayElement = fixture.nativeElement.querySelector('.current-value');
      expect(displayElement?.textContent?.trim()).toBe('123');
    });

    it('should render all calculator buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const buttons = compiled.querySelectorAll('button');
      expect(buttons.length).toBe(20); // 0-9, +, -, *, /, =, AC, CE, ⌫, ±, .
    });
  });

  describe('Input Operation Edge Cases', () => {
    it('should not calculate when waiting for new number in inputOperation', () => {
      component.inputNumber('5');
      component.inputOperation('+');
      component.waitingForNewNumber = true;
      const spy = jest.spyOn(component, 'calculate');
      component.inputOperation('*');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should reset hasDecimal flag after operation', () => {
      component.inputNumber('5');
      component.inputNumber('.');
      component.inputNumber('5');
      expect(component.hasDecimal).toBe(true);
      component.inputOperation('+');
      expect(component.hasDecimal).toBe(false);
    });
  });
});
