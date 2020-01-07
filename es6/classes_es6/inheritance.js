class Shape {
    constructor(color) {
        this.color = color;
    }

    print() {
        console.log(`${this.color} shape`);
    }

    static print() {
        console.log('in shape');
    }

    static get count() { 
        console.log('shape count was fetched');

        return !Shape._count ? 0 : Shape._count; 
    }

    static set count(val) { 
        console.log('shape count was set');

        Shape._count = val;
    }
}

class Circle extends Shape {
    constructor(radius, color) {
        super(color);
        this.radius = radius;
    }

    print() {
        console.log(`${this.color} circle with radius ${this.radius}`)
    }

    printSuper() {
        super.print();
    }

    static print() {
        console.log('in circle');
    }

    static printSuper() {
        super.print();
    }

    static set count(val) { 
        console.log('circle count was set');

        Circle._count = val; 
        Shape._count = val * 2;
    }

    static get count() { 
        console.log('circle count was fetched');

        return !this._count ? 0 : this._count; 
    }
}

Shape.print();
Circle.print();
Circle.printSuper();

Circle.count = 1;
console.log(Shape.count);
console.log(Circle.count);

c = new Circle(1.2, 'blue');
c.print();
c.printSuper();
