"use strict";

var db = require('./db');

exports.fetchCategories = function(req, res) {
    db.forumModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (categories[0] == undefined)
            return res.sendStatus(401);
        return res.send(categories[0].categories);       
    });
}

exports.createCategory = function(req, res) {
	var name = req.body.name || '';

	if (name == '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (category.length === 0) {
            console.log('creating forum');
            var forum = new db.forumModel();
	        forum.categories = [];
            forum.categories.push({name: name, id: 0, thread: []});
            forum.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                db.forumModel.find({}, function (err, forum) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log("forum created!");
                    return res.send(forum);
                });
            });
        }
        else {
            category[0].categories.push({name: name, id: category[0].categories.length, thread: []});
            category[0].save(function(err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                db.forumModel.find({}, function (err, forum) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log(name+" created!");
                    return res.send(forum);
                });
            });
        }
    });
}

exports.createSubCategory = function(req, res) {
    var name = req.body.name || '';
    var categoria = req.body.category || '';
    
	if (name == '' || categoria == '')
        return res.sendStatus(400);
    console.log(name+' '+categoria);
    db.forumModel.find({}, function(err, category) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                category[0].categories[i].subCategories.push({
                        name: name, 
                        id: category[0].categories[i].subCategories.length
                    }
                );
                category[0].save(function(err) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    db.forumModel.find({}, function (err, forum) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }   
                        console.log(name+" created!");
                        return res.send(forum);
                    });
                });
            }
        }
    });
}

exports.removeSubCategory = function(req, res) {
    var categoria = req.body.category || '';
    var subcategoria = req.body.subcategory || '';
    
    if (categoria == '' || subcategoria == '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        for (var i = 0; i < category[0].categories.length; ++i) {
            if (category[0].categories[i].name === categoria) {
                var index = 0;
                var pos = i;
                for (var j = 0; j < category[0].categories[pos].subCategories.length; ++j) {
                    if (category[0].categories[pos].subCategories[j].name === subcategoria)
                        index = 1;
                }
                if (index > 0) {
                    if (category[0].categories[i].subCategories.length === 1)
                        category[0].categories[i].subCategories.shift();
                    else
                        category[0].categories[i].subCategories.splice(index, 1);
                    category[0].save(function(err) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        db.forumModel.find({}, function (err, forum) {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            console.log(subcategoria+" deleted");
                            return res.send(forum);
                        });
                    });
                }
            }
        }
    });
}

exports.createThread = function(req, res) {
    var title = req.body.name || '';
    var body = req.body.body || '';
    var category = req.body.category || '';
    var subcategory = req.body.subcategory ||  '';
    var author = req.body.author || '';
    
    if (title === '' || body === '' || author === '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, result) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        result[0].threads.push({
            title: title,
            id: result[0].threads.length,
            creator: author,
            category: [
                { name: category },
                { name: subcategory }],
            body: body,
            comments: []
        });
        result[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log("Thread "+title+" created\n"+forum[0].threads);
                return res.send(forum[0].threads);
            });
        });
    });
}

exports.fetchThreads = function(req, res) {
    db.forumModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (categories[0] == undefined)
            return res.sendStatus(401);
        return res.send(categories[0].threads);       
    });
}

exports.postCommentBody = function(req, res) {
    var author = req.body.author || '';
    var comment = req.body.comment || '';
    var id = req.body.id || '';
    console.log(author+' '+comment+' '+id);
    db.forumModel.find({}, function(err, result) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (result[0] == undefined)
            return res.sendStatus(401);
        result[0].threads[id].bodyComments.push(
            {
                author : author,
                replyBody: comment
            }
        );
        result[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log("Comment posted");
                console.log(result[0].threads[id]);
                return res.sendStatus(200);
            });
        });
    });
}