import { Notification } from "./validators/notification";
import { ValueObject } from "./value-object";

export abstract class Entity{
  notification = new Notification()
  abstract toJSON():any
  abstract get entityId():ValueObject
}