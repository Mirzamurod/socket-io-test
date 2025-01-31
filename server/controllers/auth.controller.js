const BaseError = require('../errors/base.error')
const userModel = require('../models/user.model')
const mailService = require('../service/mail.service')

class AuthController {
  async login(req, res, next) {
    try {
      const { email } = req.body
      const existUser = await userModel.findOne({ email })

      if (existUser) {
        await mailService.sendOtp(existUser.email)
        return res.status(200).json({ message: 'Sent OTP', success: true, email: existUser.email })
      }

      await userModel.create({ email }).then(async newUser => {
        await mailService.sendOtp(newUser.email)
        res.status(200).json({ message: 'Sent OTP', success: true, email: newUser.email })
      })
    } catch (error) {
      next(error)
    }
  }

  async verify(req, res, next) {
    try {
      const { email, otp } = req.body
      const result = await mailService.verifyOtp(email, otp)

      if (result) {
        const user = await userModel.findOneAndUpdate(
          { email },
          { isVerified: true },
          { new: true }
        )
        res.status(200).json({ message: 'Verified', success: true, user })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
