class Person {

}

class Teacher extends Person {
    constructor() {
        super();
        this.name = 'asd';
    }

    getName() {
        this.age = 3;
    }

    get something() {
        return null;
    }

    set something(val) {
        //ok
    }
}

const t = new Teacher();
t.getName();

console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(t), 'getName'));
for (let prop in t) {
    console.log(prop);
}

console.log('😸');
