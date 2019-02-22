import ProxySafe from "../proxy-safe";
import SafePrototypeFields from "../safe-prototype-fields";
import { PrivateMembers, Private, Protected, Inherited } from "../private-members";

/**
 * Testing SafeProto
 */
@SafePrototypeFields
class SafeProtoTest {
    testField = {foo: "bar"};
    print() {
        console.log(`instance has testField: ${this.hasOwnProperty("testField")}`);
        console.log(`testField = ${JSON.stringify(this.testField)}`);
        this.testField.fubar = 42;
        console.log(`instance has testField: ${this.hasOwnProperty("testField")}`);
        console.log(`testField = ${JSON.stringify(this.testField)}`);
        delete this.testField;
        console.log(`instance has testField: ${this.hasOwnProperty("testField")}`);
        console.log(`testField = ${JSON.stringify(this.testField)}`);
    }
};

let spt = new SafeProtoTest()
spt.print();

@ProxySafe
@SafePrototypeFields
@PrivateMembers()
class Test {
    @Private pvtField = 1;
    @Protected protField = 42;
    pubField = Math.PI;

    constructor() {
        console.log(`Constructing Test...`);
    }
    
    privateCheck() {
        console.log(`pvtField = ${this.pvtField}`);
        console.log(`protField = ${this.protField}`);
        console.log(`pubField = ${this.pubField}`);
    }
};

@ProxySafe
@SafePrototypeFields
@PrivateMembers(Test)
class SubTest extends Test {
    @Private #pvtField = 2;
    @Inherited #protField;
    pubField2 = Math.E;

    constructor() {
        console.log(`Constructing SubTest...`);
        super();
    }

    privateCheck() {
        console.log(`pvtField = ${this.#pvtField}`);
        console.log(`protField = ${this.#protField}`);
        console.log(`pubField = ${this.pubField}`);
        console.log(`pubField2 = ${this.pubField2}`);
    }
}

console.log("Testing Private and Protected members...");
let test = new SubTest;
test.privateCheck();
