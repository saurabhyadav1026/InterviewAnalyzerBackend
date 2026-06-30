import User from "../../models/User.js";


const verifyme=(req,res)=>{
try{
    
    const user =User.findById(req.userId);

    res.status(200).json({
            status: true,
            user: {
                _id: user._id,
                rollno:user.rollno,
                name:user.name,
                branch:user.branch,
                passingyear:user.passingyear,
                email:user.email

            },
            message: "Login successful"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server error during login",
            error: error.message
        });
    }
}

export default verifyme;