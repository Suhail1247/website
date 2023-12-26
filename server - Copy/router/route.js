import { Router } from "express";
import Auth,{localvariables}  from "../middleware/auth.js";
import * as controller from '../controller/controller.js';
import { registerMail } from "../controller/mailer.js";
const router=Router();


//post methods//
router.route('/register').post(controller.register);
router.route('/login').post(controller.verifyUser,controller.login);
router.route('/registerMail').post(registerMail)
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end())

//get methods//

router.route('/user/:username').get(controller.getUser);
router.route('/generateOtp').get(controller.verifyUser,localvariables,controller.generateOtp);
router.route('/verifyOtp').get(controller.verifyUser,controller.verifyOtp);
router.route('/createResetSession').get(controller.createResetSession);

//put methods//

router.route('/updateUser').put(Auth,controller.updateUser);
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);



export default router;