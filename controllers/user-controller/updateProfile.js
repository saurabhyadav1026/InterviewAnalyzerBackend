
const updateProfie=async (req,res)=>{

const {name, email}=req.body;

try{
const updateUser=await User.findAndUpdateOne({_id:req.userId},{$set:{name,email}})

res.status(200).send({status:true,updateUser})
}catch(err){
console.log(err);
res.status(500).send({status:false,message:"somthing error"})
}


}

export default updateProfie;