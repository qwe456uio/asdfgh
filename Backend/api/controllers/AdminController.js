var mongoose    = require('mongoose');
var jwt         = require('jsonwebtoken');
var Validations = require('../utils/Validations');
var config      = require('../config/Config');
var EmailRegex  = config.EMAIL_REGEX;
var Admin          = mongoose.model('Admin');
var User           = mongoose.model('User');
var Expert         = mongoose.model('Expert');
var ExpertRequests = mongoose.model('ExpertRequests');
var Session        = mongoose.model('Session');
var SessionRequests = mongoose.model('SessionRequests');
var Question = mongoose.model('Question');
var Notification = mongoose.model('Notification');
const bcrypt = require('bcryptjs');

module.exports = 
{
    logIn : async (req, res, next) =>
    {
        //Validates email and password
        var email    = req.body.email;
        var password = req.body.password;
        var valid    = Validations.isString(email) && Validations.isString(password) &&
                        Validations.matchesRegex(email, EmailRegex) && email && password;

        //return error in case of missing fields or wrong format
        if(!valid)
            return res.status(403).json({error : "Missing Fields or Wrong Email format"});

        var adminInTable = await Admin.findOne({"email" : email});
        if(adminInTable)
        {
            var isValidPassword = await adminInTable.isValidPassword(password);
            if(isValidPassword)
            {
                //Generates JWT token 
                var token = jwt.sign({admin : adminInTable.toObject()}, req.app.get('secret'), {expiresIn : '12h'});
                return res.status(200).json({ err: null, msg: 'Welcome', data: token });
            }
            return res.status(403).json({error : "Wrong Password"});
        }

        return res.status(403).json({error : "Wrong Email"});        
    },

    createNewAdmin : async (req, res, next) =>
    {
        var adminEmail    = req.body.email;
        var adminPassword = req.body.password;
        var valid = adminEmail && Validations.isString(adminEmail) &&
                    adminPassword && Validations.isString(adminPassword);
                        
    
        //validating email and password
        if(!(valid))
        {
            return res.status(422).json({
                msg : 'Please fill out all the fields.'
            });
        }

        //checking correct email format
        if ( ! (Validations.matchesRegex(adminEmail, EmailRegex)) )
        {
	        return res.status(422).json({
                msg  : 'Please enter the email in correct format.'
            });
        }

        //checking for already existing email
        const adminemailAlreadyExists =  await Admin.findOne({"email": adminEmail });
        if(adminemailAlreadyExists)
        {
            return res.status(422).json({
                msg  : 'An admin is already created with this email.'
            });
        }

        //creating the new admin
        Admin.create(req.body, function(err, user) 
        {
            if (err)
            {
                return next(err);
            }
            res.status(200).json({
                msg  : 'Admin created Successfully!'
            });
        });
    },

    changePassword : async (req, res, next) =>
    {
        var oldpassword = req.body.oldpassword;
        var newpassword = req.body.newpassword;
        var valid       = oldpassword && newpassword;
        if(!valid)
            return res.status(403).json({error : "Missing Fields or Wrong password"});
        
        var adminemail   = req.decodedToken.admin.email; // Get admin email from token
        var adminInTable = await Admin.findOne({"email" : adminemail}); // Get admin from DB
        if(adminInTable)
        {
            var isValidPassword = await adminInTable.isValidPassword(oldpassword);
            if(isValidPassword)
            {
                // Change password
                try 
                {
                    // Generate a salt
                    const salt = await bcrypt.genSalt(10);
                    // Generate a password hash (salt + hash)
                    const passwordHash = await bcrypt.hash(newpassword, salt);
                    // Updating password
                    Admin.where({ "email": adminemail }).update({ "password": passwordHash }).exec();
                } 
                catch(error) 
                {
                    return res.status(403).json({error: "Something went wrong!"});
                }

                

                return res.status(200).json({ err: null, msg: 'Password Changed successfully'});
            }
            return res.status(403).json({error : "Wrong Password"});
        }
        return res.status(403).json({error : "Something went wrong!"});

    },

    getUsers : async (req, res, next) =>
    {
        let user_id = req.query.user;
        let User = mongoose.model('User');
        let Expert = mongoose.model('Expert');
        let Question = mongoose.model('Question');
        let SessionRequests = mongoose.model('SessionRequests');
        
        
        
        let expertInTable = await Expert.findOne({"user" : user_id}, function(err, doc) {
            if (err) {
                return res.status(422).json({
                    error: 'Invalid Date.'
                    });;
            }
            
          });
        let expertInfo = await Expert.find({user :user_id});
        let userInfo = await User.findById(user_id);

        let data = []; //initializing the data array that is going to be sent
        data.push({expertCheck : false, questionAnswered : false, questionAsked: false, sessionRequests : false});
        
        if(expertInTable)  //check if the user is expert
        {
        
                data[0].expertCheck = true;
             
        }else
        {
            let userInTable = await User.findOne({"_id": user_id});
            if(!userInTable){  // checks if the user id is available in the database
        
                return res.status(404).json({error : "User/Expert Not Found"});
        
            }
        }
        data.push(userInfo);
        data.push(expertInfo);
        


        let questionAsked = await Question.findOne({"user" : user_id});  // for checking if the item exist 
        
        
        let sessionRequests = await SessionRequests.findOne({"user" : user_id});

        let quesAsked = await  Question.find({user : user_id}); // it wil return the object if found else it will return empty array
        
        let sesRequests = await SessionRequests.find({user : user_id}).lean();

        data.push(quesAsked);// pushing the results into the array
        data.push(sesRequests);

        if (expertInTable){
            var expert_id = expertInfo[0]._id;
            let questionAnswered = await Question.findOne({"expert" : expert_id});
            if(questionAnswered){
                data[0].questionAnswered = true;
            }
            let quesAnswered = await Question.find({expert : expert_id});
            data.push(quesAnswered);
        }else{
            data.push([]);
        }
        
        if(questionAsked){
            data[0].questionAsked = true;
        }
        if(sessionRequests){
            data[0].sessionRequests = true;
            let i =0;
            let sess = data[4];
            while(i<sess.length){
                let ex_id = await Expert.findById(sess[i].expert);
                let temp = await User.findById( ex_id.user);
                let firstname = temp.firstname;
                let lastname = temp.lastname;
               
                (data[4])[i].expert = firstname + " "+lastname;
                i++;
            }
        }
        return res.status(200).json(data);
    },
    RespondToExpertRequests: async (req,res,next) =>
    {   

        var requests = await ExpertRequests.find({});
        var result=[];
        for(var i =0 ;i<requests.length;i++){
            var relatedUser = await User.findById(requests[i].user);
            result[i]={_id:requests[i]._id,user: relatedUser.firstname+' '+relatedUser.lastname, yearsOfExp: requests[i].yearsOfExp, 
            cvLink: requests[i].cvLink, status: requests[i].status, proposal: requests[i].proposal, tags:requests[i].tags}
        }
        if(requests.length==0){
            return res.status(204).json({
                msg:'There are no expert requests to show.'
            });
        }
        else
        return res.status(200).json({
            msg:'Expert requests retreived successfully.',
            data: result
        });

    },
    ApproveExpertRequest: async (req,res,next) =>
    {
      var reqID = req.params.id;
      console.log(reqID);
      var request = await ExpertRequests.findById(reqID);
      request.status = 'Approved';
      request.admin = req.decodedToken.admin._id;
      request.save(function(err){
        if(err){ 
        console.log(err);
        return res.status(422).json({
            err:err,
            msg:'Error occured',
            data:null
        })      
    }    });
      await Expert.create({user: request.user, yearsOfExp: request.yearsOfExp, cvLink: request.cvLink, expTags: request.tags}, function(err,expert){
        if(expert)
        return res.status(200).json({
            err:null,
            msg:'Expert request approved!',
            data:null
        });
      });
    },
    RejectExpertRequest: async (req,res,next) =>
    {
        var reqID = req.params.id;
        console.log(reqID);
      var request = await ExpertRequests.findById(reqID);
      request.update({admin:req.decodedToken.admin._id, status:'Rejected'}).exec(function(err,doc){
        if(err){
        return next(err); 
    console.log(next(err));      
    }
    if(doc){
        return res.status(200).json({
            msg:'Expert request rejected!'
          })
    }    
});  
        
    },
    
    FilterSessionRequests: async (req, res, next) =>
    {
        var requests = await SessionRequests.find({});
       
        var requestsinfo = [];
        var j = 0;
        if(requests.length!=0){
            for(var i =0; i<requests.length;i++){
                if((requests[i].status).toString().trim() == 'pending'){
                var userinfo = await User.find({"_id":requests[i].user}).select("email").select('-_id');
                var expertinfo = await Expert.find({"_id":requests[i].expert});
                var expertuserinfo = await User.find({"_id":expertinfo[0].user}).select("email").select('-_id');
                
                
                requestsinfo[j] = {useremail: userinfo[0].email, expertemail: expertuserinfo[0],
                    tags: requests[i].tags, requestQues: requests[i].requestQues, 
                     _id: requests[i]._id};
                j++;
                }
            }
            
        }
        if(requestsinfo.length==0){
            return res.status(422).json({
                err: null,
                msg: 'No session requests are found',
                data: null
              });
        }
        else{
            res.status(200).json({
                err: null,
                msg: 'Session requests retrieved successfully',
                data: requestsinfo
              });

        }
    
    },
    RemoveSessionRequest: async (req, res, next) =>{
        var sessionId  = req.params.id;
        SessionRequests.findByIdAndRemove(sessionId).exec(function(
            err,
            deletedRequest
          ) {
            if (err) {
              return next(err);
            }
            if (!deletedRequest) {
              return res
                .status(404)
                .json({ err: null, msg: 'No session request with this id is found', data: null });
            }
            res.status(200).json({
              err: null,
              msg: 'Session Request is removed successfully',
              data: deletedRequest
            });
          });
    },


    SearchForUser: async (req, res, next) =>
    {
        var search  = req.params.user;

    
var users =  await User.find({ $or:[{"firstname": search }, {"lastname": search}] });        
  var usr=[];

var j=0;
  if (users.length !=0){
    var quest =[];
    var request=[];
   for (var i=0 ; i< users.length ;i++){
    const experts= await Expert.findOne({ "user": users[i]._id});  
    
            if (experts != null){
                var q=[];
    
                var r=[];
                    quest = await Question.find({"expert":experts._id});
                    if (quest.length != 0){
                        for (var y=0 ; y<quest.length ;y++){
                             var questionExpert = await Question.findOne({"user":quest[y].user}).select('expert');
                             var questionExpertID = await Expert.findOne({"_id": questionExpert.expert}).select('user');
                             var questionExpertinfo = await User.findOne({"_id": questionExpertID.user}).select('email');
                             var questionUser = await User.findById(quest[y].user);
                         
                if (quest[y].answer != null ){
                          q[y]= {
                              
                    questUser: questionUser.email,
                     questExpert: questionExpertinfo.email,
                        Question: quest[y].Question ,answer:quest[y].answer  , time :quest[y].time};
                            
                        }
                        else{
                       q[y]= {
                           
                    questUser: questionUser.email, 
                    
                    questExpert: questionExpertinfo.email,
                    Question: quest[y].Question , time :quest[y].time};
                           
                
                        }
                    }
                      
                    }
request  =await SessionRequests.find({"expert":experts._id});
    if (request.length !=0 ){
        for (var y=0 ; y<request.length ;y++){
            
    var RequestUser = await User.findById(request[y].user);
    var RequestExpert = await  Expert.findOne({_id:request[y].expert}).select('user');
   var Expertinfo = await  User.findById(RequestExpert.user);
      
   
   var session = await Session.findOne({"users":request[y].user}).select('users');
            
   var sessionDate = await Session.findOne({"users":request[y].user}).select('Date');
   
   var sessionType = await Session.findOne({"users":request[y].user}).select('type');
   
   var sessionExpert = await Session.findOne({"users":request[y].user}).select('expert');
   var sessionExpertID = await Expert.findOne({"_id": sessionExpert.expert});
   var sessionExpertinfo = await User.findOne({"_id": sessionExpertID.user}).select('email');
   var SessionUser = await User.findById(session.users);

   r[y]= {
       
    sessionUser: SessionUser.email,
    sessionExpert: sessionExpertinfo.email,
    sessionDate: sessionDate.Date,
    sessionType: sessionType.type,
            userR: RequestUser.email, 
             expertR: Expertinfo.email,
           status: request[y].status
           ,
             requestQues: request[y].requestQues
        };
            
        }
    }

    if (q.length !=0 &&  r.length !=0 ){
    usr[i]= {Type:"Expert",firstname: users[i].firstname, lastname: users[i].lastname, 
            email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone 
            ,rating: users[i].rating,tags :users[i].tags ,cv :"CV Link :", cvLink : experts.cvLink , 
            years:"Years of Experience :",
            yearsOfExp:experts.yearsOfExp,
            ratingExp: "Expert Rating :"
           , expRating:experts.expRating,
           timesRated: "Rating Times :"
            ,ratedtimes: experts.ratedtimes
            ,tagsExp: "Expert Tags :"
            ,expTags:experts.expTags, Question :q ,request: r, _id:experts._id};
            
    
}

if (q.length ==0 &&  r.length !=0){
    usr[i]= {Type:"Expert",firstname: users[i].firstname, lastname: users[i].lastname, 
    email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone 
    ,rating: users[i].rating,tags :users[i].tags ,cv :"CV Link :", cvLink : experts.cvLink , 
    years:"Years of Experience :",
    yearsOfExp:experts.yearsOfExp,
    ratingExp: "Expert Rating :"
   , expRating:experts.expRating,
   timesRated: "Rating Times :"
    ,ratedtimes: experts.ratedtimes
    ,tagsExp: "Expert Tags :"
    ,expTags:experts.expTags , request :r, _id:experts._id};
    

}

if (q.length !=0 &&  r.length ==0){
    usr[i]= {Type:"Expert",firstname: users[i].firstname, lastname: users[i].lastname, 
email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone 
,rating: users[i].rating,tags :users[i].tags ,cv :"CV Link :", cvLink : experts.cvLink , 
years:"Years of Experience :",
yearsOfExp:experts.yearsOfExp,
ratingExp: "Expert Rating :"
, expRating:experts.expRating,
timesRated: "Rating Times :"
,ratedtimes: experts.ratedtimes
,tagsExp: "Expert Tags :"
,expTags:experts.expTags , Question :q , _id:experts._id};
}
if (q.length ==0 &&  r.length ==0){
    usr[i]= {Type:"Expert",firstname: users[i].firstname, lastname: users[i].lastname, 
    email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone 
    ,rating: users[i].rating,tags :users[i].tags ,cv :"CV Link :", cvLink : experts.cvLink , 
    years:"Years of Experience :",
    yearsOfExp:experts.yearsOfExp,
    ratingExp: "Expert Rating :"
   , expRating:experts.expRating,
   timesRated: "Rating Times :"
    ,ratedtimes: experts.ratedtimes
    ,tagsExp: "Expert Tags :"
    ,expTags:experts.expTags, _id:experts._id};
    
}
            }
           else {   
    var q=[];
    
var r=[];
    quest = await Question.find({"user":users[i]._id});
    console.log(quest);
    if (quest.length != 0){
        for (var y=0 ; y<quest.length ;y++){
             var questionExpert = await Question.findOne({"user":quest[y].user}).select('expert');
             var questionExpertID = await Expert.findOne({"_id": questionExpert.expert}).select('user');
             var questionExpertinfo = await User.findOne({"_id": questionExpertID.user}).select('email');
             var questionUser = await User.findById(quest[y].user);
         
if (quest[y].answer != null ){
          q[y]= {
              
    questUser: questionUser.email,
     questExpert: questionExpertinfo.email,
        Question: quest[y].Question ,answer:quest[y].answer  , time :quest[y].time};
            
        }
        else{
       q[y]= {
           
    questUser: questionUser.email, 
    
    questExpert: questionExpertinfo.email,
    Question: quest[y].Question , time :quest[y].time};
           

        }
    }
      
    }
request  =await SessionRequests.find({"user":users[i]._id});
    if (request.length !=0 ){
        for (var y=0 ; y<request.length ;y++){
            
    var RequestUser = await User.findById(request[y].user);
    var RequestExpert = await  Expert.findOne({_id:request[y].expert}).select('user');
   var Expertinfo = await  User.findById(RequestExpert.user);
      
   
   var session = await Session.findOne({"users":request[y].user}).select('users');
            
   var sessionDate = await Session.findOne({"users":request[y].user}).select('Date');
   
   var sessionType = await Session.findOne({"users":request[y].user}).select('type');
   
   var sessionExpert = await Session.findOne({"users":request[y].user}).select('expert');
   var sessionExpertID = await Expert.findOne({"_id": sessionExpert.expert});
   var sessionExpertinfo = await User.findOne({"_id": sessionExpertID.user}).select('email');
   var SessionUser = await User.findById(session.users);

   r[y]= {
       
    sessionUser: SessionUser.email,
    sessionExpert: sessionExpertinfo.email,
    sessionDate: sessionDate.Date,
    sessionType: sessionType.type,
            userR: RequestUser.email, 
             expertR: Expertinfo.email,
           status: request[y].status
           ,
             requestQues: request[y].requestQues
        };
            
        }
    }
if (q.length !=0 &&  r.length !=0 ){
    usr[i]= {Type:"User",firstname: users[i].firstname, lastname: users[i].lastname, 
        email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone ,rating: users[i].rating 
        , Question: q 
        ,request: r ,tags :users[i].tags};
    }
if (q.length ==0 &&  r.length !=0){
    usr[i]= {Type:"User",firstname: users[i].firstname, lastname: users[i].lastname, 
        email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone ,rating: users[i].rating
        ,request: r,tags :users[i].tags};
}
if (q.length !=0 &&  r.length ==0){
    usr[i]= {Type:"User",firstname: users[i].firstname, lastname: users[i].lastname, 
        email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone ,rating: users[i].rating
        , Question: q,tags :users[i].tags};
}
if (q.length ==0 &&  r.length ==0){
 
        usr[i]= {Type:"User",firstname: users[i].firstname, lastname: users[i].lastname, 
            email:users[i].email , birthdate: users[i].birthdate ,phone:users[i].phone ,rating: users[i].rating,tags :users[i].tags };
        }


 }
   }
}

   
    
          res.status(200).json({
            err: null,
            msg: 'users retrieved successfully',
            data:usr
          });

    },
    DemoteExpert : async (req, res, next) =>
    {

        var ExpertId = req.params.expertId;
        console.log(ExpertId);

        Expert.findByIdAndRemove(ExpertId).exec(function(
            err,
            deletedExpert
) {
            if (err) {
              return next(err);
            }
          if (!deletedExpert) {
              return res
                .status(404)
                .json({ err: null, msg: 'No expert with this id is found', data: null });
            }
            res.status(200).json({
              err: null,
              msg: 'Expert demoted successfully',
              data: deletedExpert
            });
          });
          var details = "You have been demoted to a user by our admins.";
          Notification.create({initiator:req.decodedToken.admin._id, receiver: deletedExpert.user , type:"Expert", details:details});
    }
    
};

//User.create({email: "david.mina96@hotmail.com", firstname: "David", lastname: "Mina", password: "1234567890", birthdate:29/11/1996});
//Session.create({Date: new Date(),expert: "5accbd628c19be0da8dbe668",users: "5ad63bef95872426bc186ba5",type: "chat",tags:["football"]});
//SessionRequests.create({user: "5acd3449553ffa2e842ac2e5",tags:["Football","Champions League"],expert: "5ada46d2c0fdc62204a88f7b",requestQues: "How did you manage to win the Golden Boot?"});
//SessionRequests.create({user: "5acd3449553ffa2e842ac2e5",tags:["Football","World Cup"],expert: "5ada46d2c0fdc62204a88f7b",requestQues: "Do you think you can win the champions league?"});
//Admin.create({email: "admin@gmail.com", password: "1234567890"});
