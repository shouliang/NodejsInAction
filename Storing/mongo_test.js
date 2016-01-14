var mongodb = require('mongodb')
var server = new mongodb.Server('127.0.0.1',27017, {})
var client = new mongodb.Db('mydatabase', server, {w: 1})
var ObjectID = mongodb.ObjectID

client.open(function(err) {
	if (err) throw err
	client.collection('test_insert', function(err, collection) {
		if (err) throw err

		collection.insert(
			{
				"title" : "I like cake",
				"body" : "It is quite good."
			},
			{safe: true},
			function(err, documents) {
				if (err) throw err
				console.log('Document ID is: ' + documents.insertedIds)
                console.log('Save success!')

                collection.update(
                	{_id : new ObjectID(documents.insertedIds.toString())},
                	{$set : {"title" : "I ate too much cake"}},
                	{safe: true},
                	function(err) {
                		if (err) throw err
                		console.log('Update success')
                	}
                )
			}
		)

	    collection.find({"title":"I like cake"}, function(err,results){
	    	if (err) throw err
	    	console.log(results)
	    })

        /*
	    collection.remove({},{safe: true}, function(err) {
	    	if (err) throw err
	    	console.log('Remove success')
	    })
		*/
	})
})
