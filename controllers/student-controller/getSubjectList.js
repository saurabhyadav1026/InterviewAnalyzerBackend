
import Subject from "../../models/Subject.js"

const getSubjectList = async (req, res) => {
    try {
       
        const sublist = await Subject.find();

      
        res.status(200).send({
            status: true,
            sublist
        });

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Error while getting subject list",
           
        });
    }
};


export default getSubjectList;