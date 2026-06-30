import Test from "../../models/Test.js";



const getConductedTest=async(req,res)=>{

try    {
const tests= await Test.find();
res.status(200).send({status:true,tests})
}catch(err){
    res.status(500).send({status:false})
}

}

export default getConductedTest;