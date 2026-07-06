import Test from "../../models/Test.js";



const getConductedTests=async(req,res)=>{

try    {
const tests= await Test.find({},{questions:0}).limit(10);

res.status(200).send({status:true,tests})
}catch(err){
    res.status(500).send({status:false})
}

}

export default getConductedTests;