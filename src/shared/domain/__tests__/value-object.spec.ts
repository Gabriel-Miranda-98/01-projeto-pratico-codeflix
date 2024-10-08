import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject{
    constructor(readonly value: string) {
        super();
    }
}

class ComplexValueObject extends ValueObject{
    constructor(readonly value: string, readonly value2: number) {
        super();
    }
}

describe("Value Object Unit Test",()=>{
    it("should create value object",()=>{
        const valueObject = new StringValueObject("Test Value")
        expect(valueObject.value).toBe("Test Value")
    })

    it("should compare value object",()=>{
        const  valueObject1 = new StringValueObject("Test Value")
        const valueObject2 = new StringValueObject("Test Value")
        expect(valueObject1.equals(valueObject2)).toBe(true)
    })


    it("should compare different value object",()=>{
        const  valueObject1 = new StringValueObject("Test Value")
        const valueObject2 = new StringValueObject("Test Value 2")
        expect(valueObject1.equals(valueObject2)).toBe(false)
    })

    it("should compare different value object type",()=>{
        const  valueObject1 = new StringValueObject("Test Value")
        const valueObject2 = new ComplexValueObject("Test Value",1)
        expect(valueObject1.equals(valueObject2)).toBe(false)
    })

    it("should compare null value object",()=>{
        const  valueObject1 = new StringValueObject("Test Value")
        const valueObject2 = null as any
        expect(valueObject1.equals(valueObject2 as any)).toBe(false)
    })


    it("should compare undefined value object",()=>{
        const  valueObject1 = new StringValueObject("Test Value")
        const valueObject2 = undefined as any
        expect(valueObject1.equals(valueObject2 as any)).toBe(false)
    })

    

})