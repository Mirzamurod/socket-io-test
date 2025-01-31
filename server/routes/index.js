const authController = require('../controllers/auth.controller')
const userController = require('../controllers/user.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const router = require('express').Router()
require('express-group-routes')

router.group('/auth', route => {
  route.post('/login', authController.login)
  route.post('/verify', authController.verify)
})

router.group('/user', route => {
  route.get('/messages/:contactId', userController.getMessages)
  route.post('/message', userController.createMessage)
  route.get('/contacts', userController.getContacts)
  route.post('/contact', userController.createContact)
  route.post('/reaction', userController.createReaction)
  route.patch('/profile', authMiddleware, userController.updateProfile)
  route.patch('/message/:messageId', userController.updateMessage)
  route.delete('/message/:messageId', userController.deleteMessage)
  route.post('/send-otp', authMiddleware, userController.sendOtp)
  route.patch('/email', authMiddleware, userController.updateEmail)
  route.delete('/', authMiddleware, userController.deleteUser)
  route.post('/message-read', userController.messageRead)
})

module.exports = router
