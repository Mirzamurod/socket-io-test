import { Schema, model, models } from 'mongoose'
import { IUser } from '@/types'

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  avatar: { type: String },
  muted: { type: Boolean, default: false },
  notificationSound: { type: String, default: 'notification' },
  sendingSound: { type: String, default: 'sending' },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

const User = models.User || model<IUser>('User', userSchema)
export default User
