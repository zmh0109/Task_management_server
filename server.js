// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Task = require('./models/task');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
mongoose.connect('mongodb://mp3:Zmh83790043@ds061731.mongolab.com:61731/mp3');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log('connection succeed!.');
});
// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");

    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// All our routes will start with /api
app.use('/api', router);

//Default route here


router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});





router.route('/users')

    .post(function(req, res) {

        var user = new User();
        if(req.body.name !=null && req.body.name !="" && req.body.name != undefined )
           user.name = req.body.name;
        if(req.body.email !=null && req.body.email !="" && req.body.email != undefined )
          user.email = req.body.email;
        if(req.body.pendingTasks !=null && req.body.pendingTasks !="" && req.body.pendingTasks != undefined )
          user.pendingTasks = req.body.pendingTasks;
        if(req.body.dateCreated !=null && req.body.dateCreated !="" && req.body.dateCreated != undefined )
          user.dateCreated = req.body.dateCreated;


        if ( user.name == "" || user.email == "" || user.name == null || user.email == null || user.name == undefined || user.email == undefined)
                 res.status(404).json({ message: ' Missing the name or email.' });
        else
            User.find( {email: req.body.email },function(err, userWithEmail){
                if (err)
                    res.status(500).json({ message: 'Error happened!', data:err });
                else
                  if (userWithEmail != "" && userWithEmail !=null && userWithEmail != undefined )
                    res.status(500).json({ message: ' Email already exist!' });
                  else
                     user.save(function(err, user) {
                        if (err)
                           res.status(500).json({ message: 'Error happened!', data:err });
                        else
                           res.status(201).json({ message: 'User created!',data:user });


                     });


            });




    })



    .get(function(req, res) {
        if(req.body.where !=null && req.body.where !="" && req.body.where != undefined)
            var where = JSON.parse( req.query.where);
        if(req.body.sort !=null && req.body.sort !="" && req.body.sort != undefined)
            var sort = JSON.parse( req.query.sort);
        if(req.body.select !=null && req.body.select !="" && req.body.select != undefined)
            var select = JSON.parse( req.query.select);
        if(req.body.skip !=null && req.body.skip !="" && req.body.skip != undefined)
            var skip = req.query.skip;
        if(req.body.limit !=null && req.body.limit !="" && req.body.limit != undefined)
            var limit = req.query.limit;

        if(req.query.count)
          User.find(where).sort(sort).select(select).skip(skip).limit(limit).count(function(err, count) {
              if (err)
                  res.status(500).json({ message: 'Error happened!', data:err });
              else
                  res.status(200).json({message: 'The number of matched users',data:count});
          });
        else
           User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function(err, user) {
             if (err)
                 res.status(500).json({ message: 'Error happened!', data:err });
             else
                 if ( user=="" || user == null || user == undefined)
                     res.status(200).json({message: 'User not found!!',data:user});
                 else

                     res.status(200).json({message: 'User found!!',data:user});

           });
    })

    .options(function(req, res){
        res.writeHead(200);

        res.end();

    });

router.route('/users/:user_id')
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.status(404).json({ message: 'Error happened!', data:err });
            else
                if(user=="" || user == null || user == undefined)
                    res.status(404).json({ message: 'User not found!', data:user });
                else
                    res.status(200).json({ message: 'User found!', data:user });



        });
    })

    .put(function(req, res) {



                User.findById(req.params.user_id, function(err, user) {
                    if (err)
                        res.status(404).json({ message: 'Error happened!', data:err });
                    else
                      if(user=="" || user == null || user == undefined)
                          res.status(404).json({ message: 'Invalid User' });
                      else
                        //if(req.body.email!=null && req.body.email!="" && req.body.email!= undefined )
                          User.find( {email: req.body.email},function(err, userWithEmail1){
                              if (err)
                                  res.status(500).json({ message: 'Error happened!', data:err });
                              else
                                //if (userWithEmail1 != "" && userWithEmail1 !=null && userWithEmail1 != undefined )
                                //     res.status(404).json({ message: ' Email already exist!' });
                                //else
                                    if(req.body.name!=null && req.body.name!="" && req.body.name!= undefined )
                                          user.name = req.body.name;
                                    if(req.body.email!=null && req.body.email!="" && req.body.email!= undefined )
                                          user.email = req.body.email;
                                    if(req.body.pendingTasks!=null && req.body.pendingTasks!="" && req.body.pendingTasks!= undefined )
                                            user.pendingTasks= req.body.pendingTasks;
                                    if(req.body.dateCreated!=null && req.body.dateCreated!="" && req.body.dateCreated!= undefined )
                                             user.dateCreated = req.body.dateCreated;

                                   user.save(function(err,user) {
                                      if (err)
                                          res.status(404).json({message: 'Error happened!', data: err});
                                      else
                                           res.status(200).json({message: 'User updated!', data:user});
                                   });
                          });
                        //else
                        //   if(req.body.name!=null && req.body.name!="" && req.body.name!= undefined )
                        //      user.name = req.body.name;
                        //   if(req.body.email!=null && req.body.email!="" && req.body.email!= undefined )
                        //      user.email = req.body.email;
                        //   if(req.body.pendingTasks!=null && req.body.pendingTasks!="" && req.body.pendingTasks!= undefined )
                        //          user.pendingTasks= req.body.pendingTasks;
                        //   if(req.body.dateCreated!=null && req.body.dateCreated!="" && req.body.dateCreated!= undefined )
                        //            user.dateCreated = req.body.dateCreated;
                        //
                        //   user.save(function(err,user) {
                        //       if (err)
                        //           res.status(404).json({message: 'Error happened!', data: err});
                        //       else
                        //             res.status(200).json({message: 'User updated!', data:user});
                        //   });
                });


    })

    .delete(function(req, res) {

        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.status(404).json({ message: 'Error happened!', data:err });
            else
              if(user=="" || user == null || user == undefined)
                 res.status(404).json({ message: 'Invalid User', data:err });
              else
                User.remove({_id: req.params.user_id}, function(err) {
                    if (err)
                        res.status(404).json({ message: 'Error happened!', data:err });
                    else
                        res.status(200).json({ message: 'User Successfully deleted' });
                });
        });
    });

router.route('/tasks')

    .post(function(req, res) {

        var task = new Task();
        if(req.body.name !=null && req.body.name !="" && req.body.name != undefined )
          task.name = req.body.name;
        if(req.body.description !=null && req.body.description !="" && req.body.description != undefined )
            task.description = req.body.description;
        if(req.body.deadline !=null && req.body.deadline !="" && req.body.deadline != undefined )
           task.deadline = req.body.deadline;
        if(req.body.completed !=null && req.body.completed !="" && req.body.completed != undefined )
           task.completed = req.body.completed;
        if(req.body.assignedUser !=null && req.body.assignedUser !="" && req.body.assignedUser != undefined )
           task.assignedUser = req.body.assignedUser;
        if(req.body.assignedUserName !=null && req.body.assignedUserName !="" && req.body.assignedUserName != undefined )
           task.assignedUserName = req.body.assignedUserName;
        if(req.body.dateCreated !=null && req.body.dateCreated !="" && req.body.dateCreated != undefined )
           task.dateCreated = req.body.dateCreated;


        if (task.name == "" ||  task.deadline == "" || task.name == null ||  task.deadline == null )
                res.status(500).json({ message: ' Missing the name or deadline.' });
        else
            task.save(function(err,task) {
                if (err)
                    res.status(404).json({ message: 'Error happened!', data:err });
                else
                        res.status(201).json({ message: 'Task created!',data:task  });


            });




    })

    .get(function(req, res) {
        if(req.body.where !=null && req.body.where !="" && req.body.where != undefined)
            var where = JSON.parse( req.query.where);
        if(req.body.sort !=null && req.body.sort !="" && req.body.sort != undefined)
            var sort = JSON.parse( req.query.sort);
        if(req.body.select !=null && req.body.select !="" && req.body.select != undefined)
            var select = JSON.parse( req.query.select);
        if(req.body.skip !=null && req.body.skip !="" && req.body.skip != undefined)
            var skip = req.query.skip;
        if(req.body.limit !=null && req.body.limit !="" && req.body.limit != undefined)
            var limit = req.query.limit;

        if(req.query.count)
            Task.find(where).sort(sort).select(select).skip(skip).limit(limit).count(function(err, count) {
                if (err)
                    res.status(500).json({ message: 'Error happened!', data:err });
                else
                    res.status(200).json({message: 'The number of matched tasks',data:count});
            });
        else
           Task.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function(err, task) {
             if (err)
                 res.status(500).json({ message: 'Error happened!', data:err });
             else
               if (task=="" || task == null || task == undefined)
                 res.status(200).json({message: 'Task not found!!',data:task});
               else

                 res.status(200).json({message: 'Task found!!',data:task});

           });
    })

    .options(function(req, res){

        res.writeHead(200);

        res.end();

    });

router.route('/tasks/:task_id')
    .get(function(req, res) {
        Task.findById(req.params.task_id, function(err,task) {
            if (err)
                res.status(404).json({ message: 'Error happened!', data:err });
            else
               if(task=="" || task == null || task == undefined)
                  res.status(200).json({ message: 'Task not found!', data:task });
               else
                  res.status(200).json({message: 'Task found!!',data:task});
        });
    })

    .put(function(req, res) {


        Task.findById(req.params.task_id, function(err, task) {
            if (err)
                res.status(404).json({ message: 'Error happened!', data:err });
            else
              if(task=="" || task == null || task == undefined)
                res.status(404).json({ message: 'Invalid Task' });
              else
                 if(req.body.name!=null && req.body.name!="" && req.body.name!= undefined )
                     task.name = req.body.name;
                 if(req.body.description!=null && req.body.description!="" && req.body.description!= undefined )
                        task.description = req.body.description;
                 if(req.body.deadline!=null && req.body.deadline!="" && req.body.deadline!= undefined )
                     task.deadline = req.body.deadline;
                 if(req.body.completed!=null && req.body.completed!="" && req.body.completed!= undefined )
                     task.completed= req.body.completed;
                 if(req.body.assignedUser!=null && req.body.assignedUser!="" && req.body.assignedUser!= undefined )
                    task.assignedUser= req.body.assignedUser;
                 if(req.body.assignedUserName!=null && req.body.assignedUserName!="" && req.body.assignedUserName!= undefined )
                     task.assignedUserName= req.body.assignedUserName;
                 if(req.body.dateCreated!=null && req.body.dateCreated!="" && req.body.dateCreated!= undefined )
                     task.dateCreated = req.body.dateCreated;

                 task.save(function(err, task) {
                    if (err)
                       res.status(404).json({message: 'Error happened!', data: err});
                    else
                       res.status(200).json({message: 'Task updated!', data: task});
                 });
        });
    })

    .delete(function(req, res) {
        Task.findById(req.params.task_id, function(err, task) {
            if (err)
                res.status(404).json({ message: 'Error happened!', data:err });
            else
                if(task=="" || task == null || task == undefined)
                    res.status(404).json({ message: 'Invalid Task!' });
                else
                    Task.remove({
                        _id: req.params.task_id
                    }, function(err) {
                        if (err)
                            res.status(404).json({ message: 'Error happened!', data:err });
                        else
                            res.status(200).json({ message: 'Task Successfully deleted' });
                    });
        });

    });





//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port); 