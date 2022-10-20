import Router from "express";
import { User } from "../models/userModel.js";
import { Client } from "../models/clientModel.js"
import { Customer } from "../models/customerModel.js"
import { AuthToken } from "../models/authtoken.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import Nylas from 'nylas';
Nylas.config({
    clientId: process.env['NYLAS_CLIENT_ID'],
    clientSecret: process.env['NYLAS_CLIENT_SECRET'],
});
const nylas = Nylas.with(process.env['NYLAS_ACCESS_TOKEN']);
const router = Router();
import nodemailer from "nodemailer";
import randomNumber from 'random-number';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
import client from 'twilio';


// Endpoint for Register
router.post("/signup", async (req, res) => {
    const viaPhone = req.body.viaPhone;
    if (!viaPhone) {
        var { email, password, name, experience, phoneNumber, language } = req.body;
        if (!email || !password) {
            return res
                .status(404)
                .json({ success: false, data: "Please Provide all necessary fields" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, data: "User Already Exists!" });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            email,
            name,
            experience,
            phoneNumber,
            language,
            passwordHash,
        });

        const savedUser = await newUser.save();
        var transport = nodemailer.createTransport({
            host: process.env["SMTP_HOST"],
            port: process.env["SMTP_PORT"],
            auth: {
                user: process.env["SMTP_USERNAME"],
                pass: process.env["SMTP_PASSWORD"]
            }
        });

        let randomCode = randomNumber({ min: 100000, max: 999999, integer: true });

        var htmlMessage = `<div style="font-family:arial,helvetica,sans-serif;font-size:14px"><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#FFFFFF" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td valign="top" bgcolor="#FFFFFF" width="100%"><table width="100%" role="content-container" align="center" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center"><tbody><tr><td role="modules-container" style="padding:0;color:#000;text-align:left" bgcolor="#FFFFFF" width="100%" align="left"><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Your 2FA Code: ${randomCode}</p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td style="font-size:6px;line-height:10px;padding:0" valign="top" align="center"><img border="0" style="display:block;color:#000;text-decoration:none;font-family:Helvetica,arial,sans-serif;font-size:16px;width:100%;max-width:100%;height:auto" width="600" alt="" src="https://iili.io/LPMeup.jpg"></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td style="padding:18px;line-height:22px;text-align:inherit;background-color:#eef6e9" height="100%" valign="top" bgcolor="#eef6e9"><div style="font-family:arial,helvetica,sans-serif;font-size:14px"><div style="font-family:inherit;text-align:left;font-size:14px"><span style="color:#000;font-size:medium;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0;text-transform:none;white-space:pre-line;widows:2;word-spacing:0;text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;font-family:arial,helvetica,sans-serif">Please enter the following authentication code to continue:</span></div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:center;font-size:14px"><span style="font-size:36px;font-family:arial,helvetica,sans-serif"><strong>${randomCode}</strong></span></div><div style="font-family:inherit;text-align:center;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:start;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;margin-left:0;font-size:14px"><span style="font-size:16px;font-family:arial,helvetica,sans-serif">Best wishes,</span></div><div style="font-family:inherit;text-align:inherit;margin-left:0;font-size:14px"><span style="font-size:16px;font-family:arial,helvetica,sans-serif">Your friends at Block Reward</span></div><div style="font-family:inherit;text-align:center;font-size:14px">&nbsp;</div><div style="font-family:arial,helvetica,sans-serif;font-size:14px">&nbsp;</div></div></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table><table role="module" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td valign="top" style="padding:30px 0 5px;font-size:6px;line-height:10px;background-color:#eef6e9"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>`

        var mailOptions = {
            from: `icebreakertestmail1@gmail.com <icebreakertestmail1@gmail.com>`,
            to: email,
            subject: `Verify Your Email Address`,
            html: htmlMessage,
        };

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.send({ success: false, data: error.message })
            }
            else {
                res.send({ success: true, data: { email: email, code: randomCode } })
            }
        });
    }
    else {
        var { country_code, phone_number, password } = req.body;
        if (!country_code || !phone_number || !password) {
            return res
                .status(404)
                .json({ success: false, data: "Please Provide all necessary fields" });
        }
        var phone = country_code + phone_number
        const existingUser = await User.findOne({ phone_number: phone });
        if (existingUser) {
            return res.status(400).json({ success: false, data: "User Already Exists!" });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            phone_number: phone,
            passwordHash: passwordHash,
        });

        const savedUser = await newUser.save();

        let randomCode = randomNumber({ min: 100000, max: 999999, integer: true });

        client(accountSid, authToken).messages
            .create({ body: 'Black Reward Singup OTP is ' + randomCode, from: process.env.TWILIO_SENDER, to: phone })
            .then(message => {
                res.send({ success: true, data: { country_code: country_code, phone_number: phone_number, code: randomCode } })
            }).catch((err) => {
                res.send({ success: false, data: err.message })
            });
    }
});

// Endpoint for Resend Code
router.post("/resend-code", async (req, res) => {
    if (!req.body.viaPhone) {
        const email = req.body.identifier;

        var transport = nodemailer.createTransport({
            host: process.env["SMTP_HOST"],
            port: process.env["SMTP_PORT"],
            auth: {
                user: process.env["SMTP_USERNAME"],
                pass: process.env["SMTP_PASSWORD"]
            }
        });

        let randomCode = randomNumber({ min: 100000, max: 999999, integer: true });

        var htmlMessage = `<div style="font-family:arial,helvetica,sans-serif;font-size:14px"><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#FFFFFF" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td valign="top" bgcolor="#FFFFFF" width="100%"><table width="100%" role="content-container" align="center" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center"><tbody><tr><td role="modules-container" style="padding:0;color:#000;text-align:left" bgcolor="#FFFFFF" width="100%" align="left"><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Your 2FA Code: ${randomCode}</p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td style="font-size:6px;line-height:10px;padding:0" valign="top" align="center"><img border="0" style="display:block;color:#000;text-decoration:none;font-family:Helvetica,arial,sans-serif;font-size:16px;width:100%;max-width:100%;height:auto" width="600" alt="" src="https://iili.io/LPMeup.jpg"></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td style="padding:18px;line-height:22px;text-align:inherit;background-color:#eef6e9" height="100%" valign="top" bgcolor="#eef6e9"><div style="font-family:arial,helvetica,sans-serif;font-size:14px"><div style="font-family:inherit;text-align:left;font-size:14px"><span style="color:#000;font-size:medium;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0;text-transform:none;white-space:pre-line;widows:2;word-spacing:0;text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;font-family:arial,helvetica,sans-serif">Please enter the following authentication code to continue:</span></div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:center;font-size:14px"><span style="font-size:36px;font-family:arial,helvetica,sans-serif"><strong>${randomCode}</strong></span></div><div style="font-family:inherit;text-align:center;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:start;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;margin-left:0;font-size:14px"><span style="font-size:16px;font-family:arial,helvetica,sans-serif">Best wishes,</span></div><div style="font-family:inherit;text-align:inherit;margin-left:0;font-size:14px"><span style="font-size:16px;font-family:arial,helvetica,sans-serif">Your friends at Block Reward</span></div><div style="font-family:inherit;text-align:center;font-size:14px">&nbsp;</div><div style="font-family:arial,helvetica,sans-serif;font-size:14px">&nbsp;</div></div></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table><table role="module" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td valign="top" style="padding:30px 0 5px;font-size:6px;line-height:10px;background-color:#eef6e9"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>`

        var mailOptions = {
            from: `icebreakertestmail1@gmail.com <icebreakertestmail1@gmail.com>`,
            to: email,
            subject: `Verify Your Email Address`,
            html: htmlMessage,
        };

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.send({ success: false, data: error.message })
            }
            else {
                res.send({ success: true, data: { email: email, code: randomCode } })
            }
        });
    }
    else {
        var code = req.body.identifier.code;
        var number = req.body.identifier.number;

        let randomCode = randomNumber({ min: 100000, max: 999999, integer: true });

        client(accountSid, authToken).messages
            .create({ body: 'Black Reward Singup OTP is ' + randomCode, from: process.env.TWILIO_SENDER, to: code + number })
            .then(message => {
                res.send({ success: true, data: { country_code: code, phone_number: number, code: randomCode } })
            }).catch((err) => {
                res.send({ success: false, data: err.message })
            });
    }
});

// Endpoint for Verify Account
router.post("/verify-account", async (req, res) => {
    if (!req.body.viaPhone) {
        const email = req.body.identifier;
        User.updateOne({ email: email }, { $set: { verified: true } })
            .then((updateUser) => {
                res.send({ success: true, data: "Verification Completed" })
            }).catch((err) => {
                res.send({ success: false, data: err.message })
            })
    }
    else {
        var phone = req.body.identifier.code + req.body.identifier.number;
        User.updateOne({ phone_number: phone }, { $set: { verified: true } })
            .then((updateUser) => {
                res.send({ success: true, data: "Verification Completed" })
            }).catch((err) => {
                res.send({ success: false, data: err.message })
            })
    }
});

router.post("/client", async (req, res) => {
    const { fullName, email, phoneNumber } = req.body;
    if (!email || !password) {
        return res
            .status(404)
            .json({ msg: "Please Provide all necessary fields" });
    }

    const existingclient = await Client.findOne({ email });
    if (existingclient) {
        return res.status(400).json({ msg: "Client Already Exists!" });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const isInterpreter = "client"
    const newClient = new Client({
        fullName,
        email,
        passwordHash,
        phoneNumber,
    });

    const savedClient = await newClient.save();
    res.send({ client: savedClient })
})

// Endpoint for Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Email or Password is missing" });
    }

    const matchClient = await User.findOne({ $or: [{ email: email }, { phone_number: email }] });

    if (matchClient !== null) {
        const matchPassword = await bcrypt.compare(
            password,
            matchClient.passwordHash
        );

        if (!matchPassword) {
            return res.status(401).json({ success: false, data: "Email or Password is invalid!" });
        }
        else if (!matchClient.verified) {
            if (matchClient.phone_number !== undefined && matchClient.phone_number.length > 0) {
                let randomCode = randomNumber({ min: 100000, max: 999999, integer: true });

                client(accountSid, authToken).messages
                    .create({ body: 'Black Reward Verification OTP is ' + randomCode, from: process.env.TWILIO_SENDER, to: matchClient.phone_number })
                    .then(message => {
                        res.send({ success: true, data: { email: matchClient.phone_number, code: randomCode }, isVerificationPending: true })
                    }).catch((err) => {
                        res.send({ success: false, data: err.message })
                    });
            }
            else {
                var transport = nodemailer.createTransport({
                    host: process.env["SMTP_HOST"],
                    port: process.env["SMTP_PORT"],
                    auth: {
                        user: process.env["SMTP_USERNAME"],
                        pass: process.env["SMTP_PASSWORD"]
                    }
                });

                let randomCode = randomNumber({ min: 100000, max: 999999, integer: true });

                var htmlMessage = `<div style="font-family:arial,helvetica,sans-serif;font-size:14px"><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#FFFFFF" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td valign="top" bgcolor="#FFFFFF" width="100%"><table width="100%" role="content-container" align="center" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center"><tbody><tr><td role="modules-container" style="padding:0;color:#000;text-align:left" bgcolor="#FFFFFF" width="100%" align="left"><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Your 2FA Code: ${randomCode}</p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td style="font-size:6px;line-height:10px;padding:0" valign="top" align="center"><img border="0" style="display:block;color:#000;text-decoration:none;font-family:Helvetica,arial,sans-serif;font-size:16px;width:100%;max-width:100%;height:auto" width="600" alt="" src="https://iili.io/LPMeup.jpg"></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td style="padding:18px;line-height:22px;text-align:inherit;background-color:#eef6e9" height="100%" valign="top" bgcolor="#eef6e9"><div style="font-family:arial,helvetica,sans-serif;font-size:14px"><div style="font-family:inherit;text-align:left;font-size:14px"><span style="color:#000;font-size:medium;font-style:normal;font-variant-ligatures:normal;font-variant-caps:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:start;text-indent:0;text-transform:none;white-space:pre-line;widows:2;word-spacing:0;text-decoration-thickness:initial;text-decoration-style:initial;text-decoration-color:initial;float:none;display:inline;font-family:arial,helvetica,sans-serif">Please enter the following authentication code to continue:</span></div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:center;font-size:14px"><span style="font-size:36px;font-family:arial,helvetica,sans-serif"><strong>${randomCode}</strong></span></div><div style="font-family:inherit;text-align:center;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:start;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;margin-left:0;font-size:14px"><span style="font-size:16px;font-family:arial,helvetica,sans-serif">Best wishes,</span></div><div style="font-family:inherit;text-align:inherit;margin-left:0;font-size:14px"><span style="font-size:16px;font-family:arial,helvetica,sans-serif">Your friends at Block Reward</span></div><div style="font-family:inherit;text-align:center;font-size:14px">&nbsp;</div><div style="font-family:arial,helvetica,sans-serif;font-size:14px">&nbsp;</div></div></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table><table role="module" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td valign="top" style="padding:30px 0 5px;font-size:6px;line-height:10px;background-color:#eef6e9"></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>`

                var mailOptions = {
                    from: `icebreakertestmail1@gmail.com <icebreakertestmail1@gmail.com>`,
                    to: email,
                    subject: `Verify Your Email Address`,
                    html: htmlMessage,
                };

                transport.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(401).json({ success: false, data: error.message });
                    }
                    else {
                        return res.status(401).json({ success: true, isVerificationPending: true, data: { email: email, code: randomCode } });
                    }
                });
            }
        }
        else {
            const token = jwt.sign(
                {
                    userId: matchClient._id,
                    emailConfirmed: matchClient.emailConfirmed,
                },
                process.env["JWT_SECRET"],
                {
                    expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                }
            );
            res.send({ success: true, token: token, id: matchClient._id, user: matchClient });
        }
    }
    else {
        return res.status(401).json({ success: false, data: "User not found!" });
    }
});

// Endpoint for Logout
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
});

// Endpoint to check if logged in
router.get("/loggedin", (req, res) => {
    if (!req.user) {
        return res.json({ loggedIn: false, emailConfirmed: false });
    }
    if (req.user.emailConfirmed)
        return res.json({ loggedIn: true, emailConfirmed: true });
    else
        return res.json({ loggedIn: true, emailConfirmed: false });


});

router.get("/sendVerifyEmail", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Invalid Token" });
    }

    User.findById(req.user.userId).then(user => {
        if (user.emailConfirmed)
            return res.json({ status: 1, msg: "Already Email Verified!" })
        let emailVerifyToken = jwt.sign(
            {
                userId: user._id
            },
            process.env["JWT_EMAIL_VERIFY_SECRET"]
        );
        let verifyUrl = `${process.env["FRONT_URL"]}/verifyEmail?token=${emailVerifyToken}`;
        const draft = nylas.drafts.build({
            subject: 'Verify Email',
            body: `<html>
                             Please click <a href="${verifyUrl}">this url</a> to verify your email!
                            </html>`,
            to: [{ name: 'My Event Friend', email: user.email }]
        });
        draft.send().then(message => {
            return res.json({ status: 2, msg: "Successfully verification email was sent!" });
        }).catch(err => {
            return res.json({ status: 3, msg: "Error in verification email!" });
        })

    }).catch(err => {
        console.log(err);
        return res.status(401).json({ msg: "Invalid Token3" });
    })
});

router.post("/sendResetEmail", (req, res) => {


    User.findOne({ email: req.body.email }).then(user => {
        let emailVerifyToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env["JWT_SECRET"]
        );
        let verifyUrl = `${process.env["FRONT_URL"]}/resetPassword?token=${emailVerifyToken}`;
        const draft = nylas.drafts.build({
            subject: 'Reset Password',
            body: `<html>
                             Please click <a href="${verifyUrl}">this url</a> to reset your password!
                            </html>`,
            to: [{ name: 'My Event Friend', email: user.email }]
        });
        draft.send().then(message => {
            return res.json({ status: 2, msg: "Successfully reset email was sent!" });
        }).catch(err => {
            return res.json({ status: 3, msg: "Error in sending reset email!" });
        })

    }).catch(err => {
        return res.status(401).json({ msg: "Not Found Email!" });
    })
});

router.get("/verifyEmail", (req, res) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Invalid Token" });
    }
    jwt.verify(req.query.token, process.env['JWT_EMAIL_VERIFY_SECRET'], async (error, decoded) => {

        if (error) {
            return res.status(401).json({ msg: "Invalid Verification Token" });
        }
        else if (req.user.userId !== decoded.userId) {
            return res.status(401).json({ msg: "Please Open verification page on the same browser in which you logged in!" });
        } else {
            let result = await User.findByIdAndUpdate(decoded.userId, { emailConfirmed: true });
            console.log(result, decoded.userId)
            const token = jwt.sign(
                {
                    userId: req.user.userId,
                    emailConfirmed: true
                },
                process.env["JWT_SECRET"],
                {
                    expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                }
            );
            return res.json({ token: token });
        }
    })

});

router.get("/verifySignupEmail", (req, res) => {
    if (req.query.token !== null && req.query.token !== undefined) {
        var token = req.query.token;
        AuthToken.findOne({ token: token, type: "signup_verification" }).then((authResponse) => {
            if (authResponse !== null) {
                User.updateOne({ email: authResponse.email }, { $set: { verified: true } })
                    .then((updateUser) => {
                        AuthToken.deleteOne({ token: token }).then((authResponse) => {
                            res.redirect(301, process.env['FRONT_URL'])
                        }).catch((err) => {
                            res.redirect(301, process.env['FRONT_URL'])
                        })
                    })
            }
            else {
                res.send("invalid token")
                setTimeout(() => {
                    res.redirect(301, process.env['FRONT_URL'])
                }, 2000);
            }
        })
    }
    else {
        res.send("invalid token")
        setTimeout(() => {
            res.redirect(301, process.env['FRONT_URL'])
        }, 2000);
    }
    // if (!req.user) {
    //     return res.status(401).json({ msg: "Invalid Token" });
    // }
    // jwt.verify(req.query.token, process.env['JWT_EMAIL_VERIFY_SECRET'], async (error, decoded) => {

    //     if (error) {
    //         return res.status(401).json({ msg: "Invalid Verification Token" });
    //     }
    //     else if (req.user.userId !== decoded.userId) {
    //         return res.status(401).json({ msg: "Please Open verification page on the same browser in which you logged in!" });
    //     } else {
    //         let result = await User.findByIdAndUpdate(decoded.userId, { emailConfirmed: true });
    //         console.log(result, decoded.userId)
    //         const token = jwt.sign(
    //             {
    //                 userId: req.user.userId,
    //                 emailConfirmed: true
    //             },
    //             process.env["JWT_SECRET"],
    //             {
    //                 expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
    //             }
    //         );
    //         return res.json({ token: token });
    //     }
    // })

});

router.post("/forgetPassword", (req, res) => {
    try {
        if (!req.body.viaPhone) {
            if (req.body.email !== undefined) {
                User.findOne({ email: req.body.email }).then((userResponse) => {
                    if (userResponse !== null) {
                        var transport = nodemailer.createTransport({
                            host: process.env["SMTP_HOST"],
                            port: process.env["SMTP_PORT"],
                            auth: {
                                user: process.env["SMTP_USERNAME"],
                                pass: process.env["SMTP_PASSWORD"]
                            }
                        });

                        let emailVerifyToken = jwt.sign(
                            {
                                userId: userResponse._id
                            },
                            process.env["JWT_EMAIL_VERIFY_SECRET"]
                        );
                        let verifyUrl = `${process.env["FRONT_URL"]}/reset-password?token=${emailVerifyToken}`;
                        var htmlMessage = `<div style="font-family:arial,helvetica,sans-serif;font-size:14px"><table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#FFFFFF" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td valign="top" bgcolor="#FFFFFF" width="100%"><table width="100%" role="content-container" align="center" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td width="100%"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td><table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px" align="center"><tbody><tr><td role="modules-container" style="padding:0;color:#000;text-align:left" bgcolor="#FFFFFF" width="100%" align="left"><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Please proceed to the following URL to continue with your password reset:<a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed;text-size-adjust:100%;width:100%"><tbody><tr><td style="font-size:6px;line-height:10px;padding:0" valign="top" align="center"><img border="0" style="display:block;color:#000;text-decoration:none;font-family:Helvetica,arial,sans-serif;font-size:16px;width:100%;max-width:100%;height:auto" width="600" alt="" src="https://iili.io/LPMO9R.jpg"></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout:fixed"><tbody><tr><td style="padding:18px;line-height:22px;text-align:inherit;background-color:#eef6e9" height="100%" valign="top" bgcolor="#EEF6E9"><div style="font-family:arial,helvetica,sans-serif;font-size:14px"><div style="text-align:inherit;font-family:inherit;font-size:14px"><span style="font-size:16px">Please proceed to&nbsp;the following URL to continue with your password reset:</span></div><div style="font-family:inherit;text-align:inherit;font-size:14px"><a href="${verifyUrl}" target="_blank"><span style="font-size:16px;word-break:break-all">${verifyUrl}</span></a></div><div style="font-family:inherit;text-align:inherit;font-size:14px">&nbsp;</div><div style="font-family:inherit;text-align:inherit;font-size:14px"><span style="font-size:16px">Best wishes,</span></div><div style="font-family:inherit;text-align:inherit;font-size:14px"><span style="font-size:16px">Your friends at Block Reward</span></div><div style="font-family:arial,helvetica,sans-serif;font-size:14px">&nbsp;</div></div></td></tr></tbody></table><table role="module" border="0" cellpadding="0" cellspacing="0" width="100%" style="visibility:hidden;opacity:0;color:transparent;height:0;width:0;display:none"><tbody><tr><td role="module-content"><p style="font-family:arial,helvetica,sans-serif;font-size:14px;margin:0;padding:0">Thank you for signing up</p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>`

                        var mailOptions = {
                            from: `icebreakertestmail1@gmail.com <icebreakertestmail1@gmail.com>`,
                            to: userResponse.email,
                            subject: `Reset Password`,
                            html: htmlMessage,
                        };

                        transport.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                //failed to send email
                                res.send({ success: false, data: error.message })
                            }
                            else {
                                AuthToken.create({ type: "reset_password", email: userResponse.email, token: emailVerifyToken }).then((respo) => {
                                    res.send({ success: true, data: "Successfull" })
                                }).catch((err) => {
                                    res.send({ success: false, data: err.message })
                                })
                            }
                        });
                    }
                    else {
                        res.status(400).json({ success: false, data: "Email not found in our system" })
                    }
                })
            }
            else {
                res.status(400).json({ success: false, data: "Email Missing" })
            }
        }
        else {
            var { country_code, phone_number } = req.body;

            User.findOne({ phone_number: country_code + phone_number }).then((userResponse) => {
                if (userResponse !== null) {
                    let emailVerifyToken = jwt.sign(
                        {
                            userId: userResponse._id
                        },
                        process.env["JWT_EMAIL_VERIFY_SECRET"]
                    );
                    let verifyUrl = `${process.env["FRONT_URL"]}/reset-password?token=${emailVerifyToken}`;

                    client(accountSid, authToken).messages
                        .create({ body: 'Click on this url to reset password ' + verifyUrl, from: process.env.TWILIO_SENDER, to: country_code + phone_number })
                        .then(message => {
                            AuthToken.create({ type: "reset_password", email: country_code + phone_number, token: emailVerifyToken }).then((respo) => {
                                res.send({ success: true, data: "Successfull" })
                            }).catch((err) => {
                                res.send({ success: false, data: err.message })
                            })
                        }).catch((err) => {
                            res.send({ success: false, data: err.message })
                        });
                }
                else {
                    res.status(400).json({ success: false, data: "Email not found in our system" })
                }
            })
        }
    } catch (error) {
        console.log(error.message)
    }
});


router.post("/resetPasswordByPanel", (req, res) => {
    try {
        if (req.body.token !== undefined) {
            var token = req.body.token;
            AuthToken.findOne({ token: token, type: "reset_password" }).then(async (authResponse) => {
                if (authResponse !== null) {
                    const saltRounds = 10;
                    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);
                    User.updateOne({ $or: [{ email: authResponse.email }, { phone_number: authResponse.email }] }, { $set: { passwordHash: passwordHash } })
                        .then((updateUser) => {
                            AuthToken.deleteOne({ token: token }).then((authResponse) => {
                                res.json({ success: true, data: "Password Reset" })
                            }).catch((err) => {
                                res.json({ success: true, data: "Password Reset" })
                            })
                        })
                }
                else {
                    res.json({ success: false, data: "Invalid Token" })
                }
            })
        }
        else {
            res.json({ success: false, data: "Token Missing" })
        }
    } catch (error) {
        console.log(error.message)
    }
});

router.post("/resetPassword", (req, res) => {
    let { email, token, newpassword, confirmpassword } = req.body;
    jwt.verify(token, process.env['JWT_SECRET'], async (error, decoded) => {
        if (error) {
            return res.status(401).json({ msg: "Invalid Reset Token" });
        }
        else if (decoded.email !== email) {
            return res.status(401).json({ msg: "Invalid Reset Token" });
        } else {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(newpassword, saltRounds);
            console.log(decoded.userId, passwordHash, newpassword)
            User.findByIdAndUpdate(decoded.userId, { passwordHash: passwordHash, emailConfirmed: true })
                .then(user => {
                    const newToken = jwt.sign(
                        {
                            userId: user._id,
                            emailConfirmed: true
                        },
                        process.env["JWT_SECRET"],
                        {
                            expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
                        }
                    );
                    return res.json({ token: newToken });
                }).catch(error => {
                    return res.status(401).json({ msg: "New Email Save Error!" });
                })

            // const token = jwt.sign(
            //     {
            //         userId: req.user._id,
            //         isUser: req.user.isUser,
            //         emailConfirmed: true
            //     },
            //     process.env["JWT_SECRET"],
            //     {
            //         expiresIn: process.env["TOKEN_EXPIRATION_TIME"]
            //     }
            // );

        }
    })

});

router.post("/info", (req, res) => {
    const { language, experience, time, phoneNumber, userId, availableTime, firstName, location, lastName, company } = req.body;
    User.findById(userId, function (err, user) {
        if (!user) {
            Client.findById(userId, function (err, client) {
                client.firstName = firstName;
                client.lastName = lastName;
                client.phoneNumber = phoneNumber
                client.company = company
                client.location = location.label;
                client.save()
                    .then((client) => res.json("client updated"))
                    .catch((error) => console.log(error, 'error'))
                if (!client) {
                    res.status(404).send("file is not found");
                }
            })
        }
        else {
            if (user.isInterpreter == "interpreter") {
                user.language = language;
                user.experience = experience;
                user.time = time;
                user.phoneNumber = phoneNumber;
                user.availableTime = availableTime;
                user.location = location.label;
            }
            user
                .save()
                .then((user) => {
                    res.json("user updated!");
                })
                .catch((err) => {
                    res.status(400).send("Update not possible");
                });
        }
    });
})

router.get("/get", (req, res) => {
    const userId = req.query.userId;
    User.findById(userId, function (err, user) {
        if (!user) {
            Client.findById(userId, function (err, client) {
                res.send({ data: "client", email: client.email })
                if (!client) {
                    res.status(404).send("user is not found");
                }
            })
        }
        else {
            res.send({ data: "Interpreter", email: user.email })
        }
    })
})

router.get("/clientinfo", (req, res) => {
    Client.find({ isInterpreter: "client" }).then((users) => res.send({ data: users }))
})
router.get("/interpreterinfo", (req, res) => {
    User.find({ isInterpreter: "interpreter" }).then((users) => res.send({ data: users }))
})

router.post("/customerData", async(req, res) => {
    const { name, phoneNumber, email, company } = req.body;
    if (!email || !phoneNumber) {
        return res
            .status(404)
            .json({ msg: "Please Provide all necessary fields" });
    }

    const existingclient = await Customer.findOne({ email });
    if (existingclient) {
        return res.status(400).json({ msg: "Customer Already Exists!" });
    }

    const isInterpreter = "customer"
    const newClient = new Customer({
        name,
        email,
        phoneNumber,
        company,
    });

    const savedClient = await newClient.save();
    res.send({ client: savedClient })
})

export default router;
