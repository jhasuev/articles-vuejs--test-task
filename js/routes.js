const Home = {
	template: `
		<app-articles></app-articles>
	`,
}
const Login = {
	template: `
		<app-login></app-login>
	`,
}
const Logout = {
	template: `<div></div>`,
	created: function() {
		
		axios.get('do_action.php?act=logout')
		.then(res => {
			router.push('/');
		}).catch(e => {
			console.error(e);
		});
	}
}
const Edit = {
	template: `
		<div>
			<app-add-article></app-add-article>
			<app-articles></app-articles>
		</div>
	`,
	created: function() {

		eventEmitter.$emit("checkAdmin", (res) => {
			if (!res) {
				router.push('/login');
			}
		});
	}
}

const routes = [
	{ path: '/', component: Home },
	{ path: '/login', component: Login },
	{ path: '/logout', component: Logout },
	{ path: '/edit', component: Edit },
]

const router = new VueRouter({
	routes :  routes,
	// mode : 'history'
})