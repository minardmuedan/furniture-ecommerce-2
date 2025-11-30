export type CustomErrorTypes = 'not_found' | 'expired' | 'unauthorized' | 'forbidden'

export class CustomError {
  type: CustomErrorTypes
  message: string

  constructor(type: CustomErrorTypes, message: string) {
    this.type = type
    this.message = message
  }
}
