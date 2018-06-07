var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CommentSchema = new Schema({
    Ticket:{
        type: Schema.Types.ObjectId, ref: 'Ticket'
      },
    initiator:{
        type: Schema.Types.ObjectId
    }
});

mongoose.model('Comment', CommentSchema);