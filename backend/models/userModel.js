const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        trim:true,
        minlength:3
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        trim:true,
        match:[/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,"Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your password"],
        minlength:[6,"Password must be at least 6 characters long"],
        //maxLength:[20,"Password must be at most 20 characters long"]
    },
    photo:{
        type:String,
        default:"https://res.cloudinary.com/dxkufsejm/image/upload/v1629299568/Avatar/Avatar_01_vlqf7y.png",
        required:[true,"Please upload your photo"]
    },
    phone:{
        type:String,
        required:[false,"Please enter your phone number"],
        match:[/^\d{10}$/,"Please enter a valid phone number"]
    },
    bio:{
        type:String,
        default:"Bio",
        maxLength:[250,"Bio must be at most 250 characters long"]
    }
},{
    timestamps:true
});

//Encrypt password before saving to database
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    //Hash the password
    const salt=await bcrypt.genSalt(10);
    this.hashedPassword=await bcrypt.hash(this.password,salt);
    this.password=this.hashedPassword;
    next();
})

const User=mongoose.model('User',userSchema);
module.exports=User;