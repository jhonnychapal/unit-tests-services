import { Calculator } from "./calculator";

describe('Test for Calculator', () => {

    describe('Tests for multiply', () => {
        it('should return nine', () => {
            // AAA = Arrange (Preparar), Act (Ejecutar o Actuar), Assert (Resolver)
            
            // Arrange:
            const calculator = new Calculator();
    
            // Act
            const rta = calculator.multiply(3,3);
    
            // Assert
            expect(rta).toEqual(9);
        });
    
        it('should return four', () => {
            // AAA = Arrange (Preparar), Act (Ejecutar o Actuar), Assert (Resolver)
            
            // Arrange:
            const calculator = new Calculator();
    
            // Act
            const rta = calculator.multiply(1,4);
    
            // Assert
            expect(rta).toEqual(4);
        });
    });

    describe('Tests for divide', () => {
        it('should return nine', () => {
            const calculator = new Calculator();
            expect(calculator.divide(6,3)).toEqual(2);
            expect(calculator.divide(5,2)).toEqual(2.5);
        });
    
        it('for a zero', () => {
            const calculator = new Calculator();
            expect(calculator.divide(6,0)).toBeNull();
            expect(calculator.divide(5,0)).toBeNull();
            expect(calculator.divide(5541566,0)).toBeNull();
        });

        it('tests matchers', () => {
            const name = 'Jhonny';
            let name2;
    
            expect(name).toBeDefined();
            expect(name2).toBeUndefined();
    
            expect(1+3===3).toBeFalsy();
            expect(1+3===4).toBeTruthy();
    
            expect(5).toBeLessThan(10);
            expect(20).toBeGreaterThan(10);
    
            expect('123456').toMatch(/123/);
    
            expect(['apples','oranges','pears']).toContain('apples');
        });
    });
})