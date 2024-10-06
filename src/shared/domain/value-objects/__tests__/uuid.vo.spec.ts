import { InvalidUuidError, Uuid } from "../uuid.vo"



describe("Uuid Value Object Unit Tests",()=>{

    const validateSpy = jest.spyOn(Uuid.prototype as any, 'isValidUuid')
    it("should throw error when uuid is invalid",()=>{
      expect(()=> new Uuid('invalid-id')).toThrow(InvalidUuidError)
      expect(validateSpy).toHaveBeenCalled()
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    it("should create uuid",()=>{
      const uuid = new Uuid()
      expect(uuid.id).toBeDefined()
      expect(validateSpy).toHaveBeenCalled()
      expect(validateSpy).toHaveBeenCalledTimes(1)
    

    })

    it("should create uuid with id",()=>{
      const uuid = new Uuid('f47ac10b-58cc-4372-a567-0e02b2c3d479')
      expect(uuid.id).toBe('f47ac10b-58cc-4372-a567-0e02b2c3d479')
    })

    it("should be called with method isValidUuid",()=>{
      const uuid = new Uuid('f47ac10b-58cc-4372-a567-0e02b2c3d479')
      expect(uuid.id).toBeDefined()
      expect(validateSpy).toHaveBeenCalled()
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })
})