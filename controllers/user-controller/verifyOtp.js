import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Otp from "../../models/Otp.js";
import { register } from "./registerController.js";

const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    const token = req.cookies.otpToken;

    if (!token) return res.status(401).send({ status: false, message: "Verification token missing or expired." });

    if (!otp) return res.status(404).send({ status: false, message: "OTP is required." });

    try {
        const payloade = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const otpDoc = await Otp.findOne({ email: payloade.user.email });

        if (!otpDoc) {
            return res.status(400).send({
                status: false,
                message: "OTP not found or expired",
            });
        }
        if (new Date() > otpDoc.expiresAt) {
            return res.status(400).send({
                status: false,
                message: "OTP expired",
            });
        }

        const valid = await bcrypt.compare(
            req.body.otp,
            otpDoc.otpHash
        );

        if (!valid) {
            otpDoc.attempts += 1;
            await otpDoc.save();

            return res.status(400).send({
                status: false,
                message: "Invalid OTP",
            });
        }

        await Otp.deleteOne({
            _id: otpDoc._id,
        });

        const response = await register(payloade.user);
        res.clearCookie("otpToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 5 * 60 * 1000
        });

        if (response.status) res.status(200).send({ status: true, message: "register successfully." });
        else {
            res.status(500).send(response);
        }

    } catch (err) {
        console.log(err);
        res.status(401).send({ status: false, message: "Invalid or expired token" });
    }
}

export default verifyOtp;