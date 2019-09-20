const eventEmitter = new Vue();

const app = new Vue({
	el : '#app',
	data : {
		is_admin : false
	},
	methods : {},
	created : function() {
		eventEmitter.$on("checkAdmin", (fn) => {
			axios.get('do_action.php?act=check_admin')
			.then(res => {
				this.is_admin = res.data;
				fn(res.data);
			}).catch(e => {
				console.error(e);
			});
		});

		eventEmitter.$emit("checkAdmin", (res) => {
			this.is_admin = !!res;
		});
	},
	router : router,
})