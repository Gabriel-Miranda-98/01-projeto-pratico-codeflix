import { Sequelize, SequelizeOptions } from "sequelize-typescript"
import { Config } from "../config"

export function setupSequelize (options:SequelizeOptions ={}){
  let _sequelize: Sequelize
  beforeAll(async()=>{
    const dbConfig = Config.db()
    _sequelize = new Sequelize({
      ...dbConfig,
      ...options, 
    })

  })

  beforeEach(async()=>{
    await _sequelize.sync({force: true})
  })

  afterAll(async()=>{
    await _sequelize.close()
  })

  return {
    get sequelize(){
      return _sequelize
    }
  }
}