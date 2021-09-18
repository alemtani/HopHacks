const  {Schema, model} = require("mongoose");

const reportSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    website:{
        type:String,
        required:true
    },
    fraudType:{
        type:String,
        required:true
    },
    description:{
        type:String
    }
},
{
    timestamps:true
}
)

module.exports = model("report",reportSchema);