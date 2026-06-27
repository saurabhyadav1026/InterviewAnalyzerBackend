import express from "express"
import v1Route from "./routes/v1Route.js";


const app= express();


app.use("/api/v1",v1Route);



app.listen(3000,()=>{
    console.log("Server is running")
})
=======
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
>>>>>>> 7d18dbcb13e4faadc4005ba6227825655b084ec1
