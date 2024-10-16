import { Category, CategoryConstructorProps, CategoryRestoreProps, CategoryCreateCommand } from "../category.entity";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";

describe('Category Entity Unit Tests', () => {
  let validateSpy: jest.SpyInstance;
  beforeEach(() => {
    Category.prototype.validate = jest
      .fn()
      .mockImplementation(Category.prototype.validate);
    validateSpy = jest.spyOn(Category.prototype, 'validate');
  });
  describe('Category without Validator Unit Tests', () => {
    it('should create a category with all props using method create', () => {
      const category = Category.create({
        name: 'test name',
        description: 'test description',
        isActive: true,
      })
      expect(category).toBeInstanceOf(Category)
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('test name')
      expect(category.description).toBe('test description')
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
    })

    it('should create a category with all props using constructor', () => {
      const category = new Category({
        name: 'test name',
        description: 'test description',
        isActive: true,
      })
      expect(category).toBeInstanceOf(Category)
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('test name')
      expect(category.description).toBe('test description')
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
    })

    it('should restore a category with all props', () => {
      const category = Category.restore({
        categoryId: 'f47b1b3e-7b4b-4b1b-8e4e-0b1f7d3e1b1b',
        name: 'test name',
        description: 'test description',
        isActive: true,
        createdAt: new Date(),
      })
      expect(category).toBeInstanceOf(Category)
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('test name')
      expect(category.description).toBe('test description')
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(category.notification.hasErrors()).toBeFalsy()
       expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    it('should be possible to create a category by just passing the name', () => { 
      const category = Category.create({
        name: 'test name',
      })
      expect(category).toBeInstanceOf(Category)
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('test name')
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(category.notification.hasErrors()).toBeFalsy()
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    it('should be possible to create a category by just passing the name and description', () => {
      const category = Category.create({
        name: 'test name',
        description: 'test description',
      })
      expect(category).toBeInstanceOf(Category)
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('test name')
      expect(category.description).toBe('test description')
      expect(category.isActive).toBe(true)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(category.notification.hasErrors()).toBeFalsy()
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    it('should be possible to create a category by just passing the name and isActive', () => {
      const category = Category.create({
        name: 'test name',
        isActive: false,
      })
      expect(category).toBeInstanceOf(Category)
      expect(category.categoryId).toBeInstanceOf(Uuid)
      expect(category.name).toBe('test name')
      expect(category.description).toBeNull()
      expect(category.isActive).toBe(false)
      expect(category.createdAt).toBeInstanceOf(Date)
      expect(category.notification.hasErrors()).toBeFalsy()
      expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    it('should be possible change the name of a category', () => {
      const category = Category.create({
        name: 'test name',
      })
      category.changeName('new name')
      expect(category.name).toBe('new name')
      expect(category.notification.hasErrors()).toBeFalsy()
      expect(validateSpy).toHaveBeenCalledTimes(2)
    })

    it('should be possible change the description of a category', () => {
      const category = Category.create({
        name: 'test name',
      })
      category.changeDescription('new description')
      expect(category.description).toBe('new description')
      expect(category.notification.hasErrors()).toBeFalsy()
    })

    it('should be possible activate of a category', () => {
      const category = Category.create({
        name: 'test name',
        isActive: false,
      })
      category.activate()
      expect(category.isActive).toBe(true)
      expect(category.notification.hasErrors()).toBeFalsy()
    })

    it('should be possible deactivate of a category', () => {
      const category = Category.create({
        name: 'test name',
        isActive: true,
      })
      category.deactivate()
      expect(category.isActive).toBe(false)
      expect(category.notification.hasErrors()).toBeFalsy()
    })

    it('should throw error when name is too long', () => {
      const category = Category.create({
        name: 'a'.repeat(256),
      })
      expect(category.notification.hasErrors()).toBeTruthy()
      expect(validateSpy).toHaveBeenCalledTimes(1)
      expect(category.notification.toJSON()).toEqual(expect.arrayContaining([expect.objectContaining({
        name: ['name must be shorter than or equal to 255 characters']
      })]))
    })
  })
})