// MainPanel

require('styles/main_panel.css');

module.exports = Backbone.View.extend({
	id: 'MainPanel',
	className: 'container',
	template: `
		<div rv-each-door="doors" class="row">
			<div class="col-md-6">
				<button
					rv-show="door:available"
					rv-data-id="door:id"
					class="btn btn-default open-door">
						{ door:name }
				</button>
			</div>
		</div>
		<div rv-hide="hasAvail">
			No doors available
		</div>
	`,
	events: {
		'click .open-door': 'openDoor',
	},
	initialize: function() {
		this.hasAvail = true;
		this.doors = new (Backbone.Collection.extend({
			url: 'doors',
		}))();
		this.doors.on('sync', _.bind(function() {
			//TODO: render should not be nessicary
			this.hasAvail = !!this.doors.findWhere({available: true}),
			this.render();
		}, this));
		this.doors.fetch();
	},
	render: function(){
		this.scope = {
			doors: this.doors,
			hasAvail: this.hasAvail,
		};
		this.$el.html(this.template);
		Rivets.bind(this.$el, this.scope);
		return this;
	},
	openDoor: function(e) {
		var target = this.$(e.currentTarget);
		var door = this.doors.find({id: target.data('id')});
		door.sync(null, this, {
			url: door.url()+'/open',
			method: 'POST',
			success: function() {
				target.addClass("opened");
				setTimeout(function() {
					target.removeClass("opened");
				}, 1500);
			}
		});
	},
});
