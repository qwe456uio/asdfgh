var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
const bcrypt = require('bcryptjs');

var AdminSchema = new Schema({
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
      }
});
AdminSchema.pre('save', async function(next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Generate a password hash (salt + hash)
    const passwordHash = await bcrypt.hash(this.password, salt);
    // Saving the hash in the password attribute
    this.password = passwordHash;
    next();
  } catch(error) {
    next(error);
  }
});

AdminSchema.methods.isValidPassword = async function(newPassword) {
    // check(hash(passwordentered) == storedpassword)
  try {
    return await bcrypt.compare(newPassword, this.password);
  } catch(error) {
    throw new Error(error);
  }
}

if (!AdminSchema.options.toObject) {
  AdminSchema.options.toObject = {};
}
//Converts User to an Object without Password 
AdminSchema.options.toObject.transform = (document, transformedDocument) => {
  delete transformedDocument.password;
  return transformedDocument;
};

mongoose.model('Admin', AdminSchema);

 //Creating an Admin
/*
var a = mongoose.model('Admin');
a.create( { email: "admin@gmail.com", password: "anaadmin" } );
*/