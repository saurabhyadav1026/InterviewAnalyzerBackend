



import Otp from "../../models/Otp.js";
import { register } from "./registerController.js";



const verifyOtp = async (req, res) => {

    const { otp } = req.body;

    const token = req.cookies.otpToken;

    if (!token) res.status(401).send({ status: false });



    if (!otp) res.status(404).send({ status: false, message: "OTP is required." });
    try {



        const payloade = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const _otp = await Otp.findOne({ email: payloade.user.email })

        if (!_otp) {
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
  _id: _otp._id,
});

        const response = await register(payloade.user);
        res.clearCookie("otpToken", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 5 * 60 * 1000
        });

        if (response.status) res.status(200).send({ status: true, message: "register successfully." })
        else {
            res.status(500).send(response);
        }

    }

    catch (err) {
        console.log(err);
        console.log("yha err ba")
        res.status(401).send({ status: false })
    }


}


export default verifyOtp;