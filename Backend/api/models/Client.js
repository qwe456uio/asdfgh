var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ClientSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim: true,
        unique:true,
        lowercase:true
      },  
      email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
          },
          password: {
            type: String,
            required: true,
            trim: true
          },
          phone:{
              type: Number,
              required: true,
              trim: true
          },
          companyName:{
              type: String,
              required: true,
              trim: true,
          },
          branchName:{
            type: String,
            required: true,
            trim: true,            
          },
          address:{
            type: String,
            required: true,
            trim: true,
          }
  });

mongoose.model('Client', ClientSchema);