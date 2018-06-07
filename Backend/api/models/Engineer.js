var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var EngineerSchema = new Schema({
    username:{
        type:String,
        required:true,
        trim: true,
        unique:true,
        lowercase:true
      },  
      firstName: {
          type: String,
          required: true,
          lowercase: true,
          trim: true
        },
        lastName: {
          type: String,
          required: true,
          lowercase: true,
          trim: true
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
          }
  });
mongoose.model('Engineer', EngineerSchema);

  