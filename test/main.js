import ProxySafe from "../proxy-safe";
import SafeProto from "../safe-proto";
import PrototypeFields from "../prototype-fields"
import { PrivateMembers, Private, Protected, Inherited } from "../private-members";


/**
 * Testing SafeProto
 */
@PrototypeFields
@SafeProto
class SafeProtoTest {
    testField = {foo: "bar"};
    print() {
        debugger;
        console.log(`instance has testField: ${"testField" in instance}`);
        console.log(`testField = ${JSON.stringify(testField)}`);
        this.testField.fubar = 42;
        console.log(`instance has testField: ${"testField" in instance}`);
        console.log(`testField = ${JSON.stringify(testField)}`);
        delete this.testField;
        console.log(`instance has testField: ${"testField" in instance}`);
        console.log(`testField = ${JSON.stringify(testField)}`);
    }
};
new SafeProtoTest().print();

@ProxySafe
@SafeProto
@PrivateMembers()
class Test {
    @Private pvtField = 1;
    @Protected protField = 42;
    pubField = Math.PI;
    
    privateCheck() {
        console.log(`pvtField = ${this.pvtField}`);
        console.log(`protField = ${this.protField}`);
        console.log(`pubField = ${this.pubField}`);
    }
};

@ProxySafe
@SafeProto
@PrivateMembers(Test)
class SubTest extends Test {
    @Private pvtField = 2;
    @Inherited protField;
    pubField2 = Math.E;

    privateCheck() {
        console.log(`pvtField = ${this.pvtField}`);
        console.log(`protField = ${this.protField}`);
        console.log(`pubField = ${this.pubField}`);
        console.log(`pubField2 = ${this.pubField2}`);
    }
}

let test = new SubTest;
test.privateCheck();
