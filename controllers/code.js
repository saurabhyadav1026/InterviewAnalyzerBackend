const getSubjectController = async (req, res) => {
    try {
       
        const sublist = await Subject.find({});

      
        res.status(200).json({
            success: true,
            message: "Subject list fetched successfully",
            count: sublist.length, 
            sublist
        });

    } 
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error while getting subject list",
            error: error.message
        });
    }
};