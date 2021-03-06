/**
 * Source of the Post Model
 */

// Exports
module.exports = {

	/**
	 * Class dependencies
	 */
	extend: ['ActiveRecord'],

	/**
	 * PRIVATE
	 */
	private: {
        blongular: null
    },

	/**
	 * Public Variables
	 */
	public: {},

	/**
	 * Methods
	 */
	methods: {

        /**
         * After model inits...
         */
        afterInit: function () {
            blongular = this.getParent().getComponent('blongular');
        },

		/**
		 * Return the name of the db collection or table.
		 */
		collectionName: function ()
		{
			return 'Post';
		},

		/**
		 * Example of a schema.
		 */
		schema: function ()
		{
			return {
				slug: {
					type: String,
					label: 'Slug',
					unique: true,
					required: true
				},
				createDate: {
					type: Date,
					label: 'Created',
					required: true
				},
				publishDate: {
					type: Date,
					label: 'Published'
				},
				title: {
					type: String,
					label: 'Title'
				},
				subtitle: {
					type: String,
					label: 'Subtitle'
				},
				content: {
					type: String,
					label: 'Content'
				},
				user: {
					type: 'ObjectId',
					label: 'UserID',
					required: true
				},
				category: {
					type: Array,
					label: 'Category'
				},
				tags: {
					type: Array,
					label: 'Tags'
				}
			};
		},

		/**
		 * Util: Format posts attributes.
		 * @param object $post
		 */
		formatPost: function (post)
		{
			if (!_.isObject(post))
				return post;
			else
			{
				var post = _.extend({},post);

				if (post.subtitle && post.subtitle !== '')
					post.preview = function (chunk) { return chunk.write(this.html) }.bind({ html: '<p>'+post.subtitle+'</p>' });
				else if (post.content && post.content !== '' && post.content !== '<p><br></p>')
					post.preview = function (chunk) { return chunk.write(this.html) }.bind({ html: post.content.split('</p>')[0]+'</p>' });
				else
					post.preview = function (chunk) { return chunk.write(this.html) }.bind({ html: '<p>Click here to edit this post.</p>' });

				post.content = function (chunk) { return chunk.write(this.html) }.bind({ html: post.content.replace(/\<p\>\{showmore\}\<\/p\>/gim,'') });

				post.listTitle = post.title;
				if (post.listTitle === "")
					post.listTitle = "Post #"+post._id;

				post.primaryTag = post.tags[0];
				self.formatDates(post);
				return post;
			}
		},

		/**
		 * Util: Format posts dates.
		 * @param object $post
		 */
		formatDates: function (post)
		{
			if (!_.isObject(post))
				return post;
			else
			{
				for (p in post)
					if (_.isDate(post[p]))
					{
						var moment = self.getDbConnection().getParent().moment(post[p]);
						post[p+'_full']=moment.format('DD MMM YYYY');
					}
			}
		},

		/**
		 * Promise: List N posts starting on N2.
		 * @param number $offset
		 * @param number $limit 
		 * @param number $order (1 for ASC, -1 for DESC)
		 * @param number $published only?
		 */
		$list: function (offset,limit,order,published::Boolean)
		{
			limit = Number(limit) || 1;
			offset = Number(offset) || 0;
			order = Number(order) || -1;
			published = Boolean(published);

			var query = {
				sort: { _id: order },
				skip: offset,
				limit: limit
			};

			if (published)
				query.exists = ['publishDate',true];

			var cb = function (err,posts) {
				if (err!==null)
					return done.reject(err);

				var fposts = [];
				for (p in posts)
					fposts.push(self.formatPost(posts[p]._doc));

                blongular.e.listPost(fposts);
				done.resolve(fposts)
			}

			this.query(query).exec(cb);

			return done.promise;
		},

		/**
		 * Promise: Find posts with those specs.
		 * @param object $spec
		 */
		$find: function (spec)
		{
			if (!_.isObject(spec))
				done.reject(new Error(''));
			else
				this.find(spec,function (e,err,posts) {
					if (err)
						return done.reject(err);

					done.resolve(posts);
				});

			return done.promise;
		},

		/**
		 * Promise: Load a post.
		 */
		$load: function (id)
		{
			if (_.isUndefined(id)||!_.isString(id))
				done.reject(new Error(''));
			else
			{
				var query = [];

				if (/^[0-9a-fA-F]{24}$/.test(id))
					query.push({ _id: id })

				query.push({ slug: id });

				this.$find({ $or: query })
				.then(function (posts) {
                    blongular.e.getPost(posts);

					if (posts[0])
						self.setAttributes(posts[0]);
					done.resolve();
				})
				.catch(function (err) {
					done.reject(err);
				});
			}

			return done.promise;
		},

		/**
		 * Promise: Update this post.
		 */
		$update: function (data:::Object)
		{
			var _id = self.attr('_id');
			var user = self.attr('user');
			if (_.isUndefined(_id)||_.isUndefined(user))
				done.reject(new Error(''));
			else
			{
				delete data.user;
				this.update({ _id: _id, user: user }, data, function (e,err) {
					if (err!==null)
						return done.reject(err);

					done.resolve(true);
				});
			}

			return done.promise;
		},

		/**
		 * Promise: Remove this post.
		 */
		$remove: function ()
		{
			var _id = self.attr('_id');
			var user = self.attr('user');

			if (_.isUndefined(_id)||_.isUndefined(user))
				done.reject(new Error(''));
			else
			{
				this.delete({ _id: _id, user: user },function (e,err,posts) {
					if (err!==null)
						return done.reject(err);

					done.resolve(true);
				});
			}

			return done.promise;
		},

		/**
		 * Promise: Save this post.
		 */
		$save: function ()
		{
			if (_.isUndefined(self.attr('user')))
				done.reject(new Error(''));
			else
			{
				this.setAttributes({ createDate: new Date });
				this.save(function (e,err,post) {

					if (err!==null)
						return done.reject(err);

					self.setAttributes(post)

					done.resolve(true);

				});
			}

			return done.promise;
		}

	}

};
