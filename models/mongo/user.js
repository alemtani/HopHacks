const  {Schema, model} = require("mongoose");

const reportSchema = new Schema({
    username :{
        type : String,
        required : true,
        min: 3,
        max : 10,
        unique :true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50
    },
    password:{
        type:String,
        required:true,
        min:6
    }
},
{
    timestamps:true
}
)

module.exports = model("report",reportSchema);