var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CounterSchema = Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
});
var counter = mongoose.model('counter', CounterSchema);

var TicketSchema = new Schema({
    ticketNo:{
        type:Number,
        required:true,
        trim: true,
        unique:true
      },
      Secretary:{
        type: Schema.Types.ObjectId, ref: 'Secretary', unique: true
      },
      Engineer:{
        type: Schema.Types.ObjectId, ref: 'Engineer', unique: true
      },
      Client:{
        type: Schema.Types.ObjectId, ref: 'Client', unique: true
      },
      createdAt:{
          type: Date,
          required: true
      },
      modifiedAt:{
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum : ['Open','On Hold','In Progress','Closed'],
        default: 'Open'
    },
    priority:{
        type: String,
        enum : ['High','Medium','Low']
    }
    
});

TicketSchema.pre('save', function(next) {
    var doc = this;
    counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
        if(error)
            return next(error);
        doc.ticketNo = counter.seq;
        next();
    });
});

mongoose.model('Ticket', TicketSchema);