


const getTestReport=(req,res)=>{
res.status(200).send({status:true,testId:req.query.testId})


}

export default getTestReport