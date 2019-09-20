Vue.component('app-add-article', {
	template: `
		<div class="add-article  container" v-if="is_admin">
			<form @submit.prevent="add_article()" class="add-article__form">
				<div class="add-article__form-fields">
					<input type="text" class="add-article__form-fields-item  form-input" placeholder="Название статьи" v-model="title">
					<textarea class="add-article__form-fields-item  form-textarea" placeholder="Описание статьи"  v-model="text"></textarea>
				</div>
				<div class="add-article__form-action">
					<button class="add-article__form-action-btn  form-btn">Добавить статью</button>
				</div>
			</form>
		</div>
	`,
	data : function () {
		return {
			is_admin : false,
			title : '',
			text : '',
			pushing : false,
		}
	},
	methods : {
		add_article : function() {
			// console.log(this.title, this.text);
			if (this.title.trim() && this.text.trim() && !this.pushing) {
				this.pushing = true;

				axios.get('do_action.php?act=add_post',{
					params: {
						title: this.title,
						text: this.text,
					}
				})
				.then(res => {
					this.pushing = false;
					this.title = '';
					this.text = '';
					eventEmitter.$emit("update_posts");
				}).catch(e => {
					this.pushing = false;
					this.title = '';
					this.text = '';
					console.error(e);
				});
			}
		}
	},
	created : function() {
		eventEmitter.$emit("checkAdmin", (res) => {
			this.is_admin = !!res;
		});
	}
});

Vue.component('app-login', {
	template: `
		<div class="login container">
			<h2 class="login__title">Вход</h2>
			<form @submit.prevent="get_login()" class="login__form">
				<div class="login__form-fields">
					<input type="text" class="login__form-fields-item  form-input" placeholder="Логин" autocomplete="off" v-model="login">
					<input type="password" class="login__form-fields-item  form-input" placeholder="Пароль" autocomplete="off" v-model="password">
				</div>
				<div class="login__form-errors-text" v-show="errors">Логин или пароль неверны</div>
				<div class="login__form-action">
					<button class="login__form-action-btn form-btn">Войти</button>
				</div>
			</form>
		</div>
	`,
	data : function () {
		return {
			login : '',
			password : '',
			logining : false,
			errors : false,
		}
	},
	methods : {
		get_login : function() {
			// console.log(this.login, this.password);

			if (this.login && this.password && !this.logining) {
				this.pushing = true;
				this.errors = false;
				axios.get('do_action.php?act=login',{
					params: {
						login: this.login,
						password: this.password,
					}
				})
				.then(res => {
					this.logining = false;
					// console.log(res.data);
					if (res.data) {
						this.errors = false;
						router.push('/edit');
					} else {
						this.errors = true;
					}
				}).catch(e => {
					this.logining = false;
					console.error(e);
				});
			} else {
				this.errors = true;
			}
		}
	}
});

Vue.component('app-articles', {
	template: `
		<div class="articles container">
			<article class="articles__item article"   v-for="(post, id) in posts" :post="post" :key="id" :id="id" :is_admin="is_admin">
				<div class="article__acts" v-if="is_admin">
					<a @click="edit(post, id)" class="article__acts-item  article__acts-item--edit">Редактировать</a>
					<a @click="remove(id)" class="article__acts-item  article__acts-item--remove">Удалить</a>
				</div>
				<h2 class="article__title">{{ post.title }}</h2>
				<div class="article__text">{{ post.text }}</div>
				<div class="article__date">{{ timeStringify(post.date) }}</div>
			</article>
		</div>
	`,
	data : function () {
		return {
			is_admin : true,
			posts : []
		}
	},
	methods : {
		timeStringify : function(ts){
			let d = new Date(ts * 1000); // сюда будет летать метка времени сгенерированная в php, поэтому умножаем на 1000
			let s = '';
				s += ((d.getDate() < 10)?'0':'') + d.getDate();
				s += '.';
				s += (((d.getMonth()+1) < 10)?'0':'') + (d.getMonth()+1);
				s += '.';
				s += ((d.getFullYear() < 10)?'0':'') + d.getFullYear();
				s += ' в ';
				s += ((d.getHours() < 10)?'0':'') + d.getHours();
				s += ':';
				s += ((d.getMinutes() < 10)?'0':'') + d.getMinutes();

			return s;
		},
		loadPosts : function() {
			axios.get('do_action.php?act=get_posts')
			.then(res => {
				this.posts = res.data;
			}).catch(e => {
				console.error(e);
			});
		},
		remove : function(id) {
			eventEmitter.$emit('popup_open', {
				popup : 'app-popup-remove',
				post_id : id,
			})
		},
		edit : function(post, id) {
			eventEmitter.$emit('popup_open', {
				popup : 'app-popup-edit',
				post : post,
				post_id : id,
			})
		},
	},
	created : function() {
		this.loadPosts();

		eventEmitter.$on("update_posts", () => {
			this.loadPosts();
		});

		eventEmitter.$emit("checkAdmin", (res) => {
			this.is_admin = !!res;
		});
	}

});

Vue.component('app-popup', {
	template: `
		<div class="popup" :class="{'popup--show' : popup_show}">
			<div class="popup__container">
				<div :is="params.popup" :params="params" @closePopup="closePopup()"></div>
				<div class="popup__bg" @click="closePopup()"></div>
			</div>
		</div>
	`,
	data : function () {
		return {
			popup_show : false,
			params : {},
		}
	},
	methods : {
		closePopup : function() {
			eventEmitter.$emit('popup_close');
		}
	},
	created : function() {
		console.log('created:popup_open');
		eventEmitter.$on('popup_open', (params) => {
			console.log('on:popup_open');
			this.popup_show = true;
			this.params = params;
		})
		eventEmitter.$on('popup_close', () => {
			console.log('on:popup_close');
			this.popup_show = false;
			this.params = {};
		})
	}

});

Vue.component('app-popup-remove', {
	props : ['params'],
	template: `
		<div class="popup__item">
			<div class="popup__close" @click="$emit('closePopup')">&times;</div>
			<div>
				<div class="post-remove">
					<div class="post-remove__title">Хотите удалить запись?</div>
					<div class="post-remove__btns">
						<a @click="closePopup()" class="post-remove__btns-item  form-btn">Нет</a>
						<a @click="remove()" class="post-remove__btns-item  form-btn  form-btn--red">Да, удалить</a>
					</div>
				</div>
			</div>
		</div>
	`,
	data : function () {
		return {}
	},
	methods : {
		closePopup : function() {
			eventEmitter.$emit('popup_close');

		},
		remove : function() {
			axios.get('do_action.php?act=remove_post',{
				params: {
					post_id: this.params.post_id,
				}
			})
			.then(res => {
				eventEmitter.$emit("popup_close");
				eventEmitter.$emit("update_posts");
			}).catch(e => {
				console.error(e);
			});
		},
	}

});

Vue.component('app-popup-edit', {
	props: ['params'],
	template: `
		<div class="popup__item">
			<div class="popup__close" @click="$emit('closePopup')">&times;</div>
			<div>
				<div class="post-edit">
					<div class="post-edit__title">Редактирование</div>
					<form @submit.prevent="edit()" class="post-edit__form">
						<div class="post-edit__form-fields">
							<input type="text" class="post-edit__form-fields-item  form-input" placeholder="Название записи"
									v-model="title">
							<textarea class="post-edit__form-fields-item  form-textarea" placeholder="Название записи"
									v-model="text"></textarea>
						</div>
						<div class="post-edit__form-actions">
							<button class="post-edit__form-actions-btn  form-btn  form-btn--green">Изменить</button>
							<a @click="closePopup()" href="javascript:" class="post-edit__form-actions-btn  post-edit__form-actions-btn--pure-link">Оставить без изменения</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	`,
	data : function () {
		return {
			title : '',
			text : '',
		}
	},
	methods : {
		closePopup : function() {
			eventEmitter.$emit("popup_close");
		},
		edit : function() {

			if (this.title == this.params.post.title && this.text == this.params.post.text) {
				console.log('nothing is changed');
				eventEmitter.$emit("popup_close");
			} else {
				if (this.title.trim() && this.text.trim()) {
					axios.get('do_action.php?act=edit_post',{
						params: {
							post_id: this.params.post_id,
							title: this.title,
							text: this.text,
						}
					})
					.then(res => {
						console.log(res);

						eventEmitter.$emit("popup_close");
						eventEmitter.$emit("update_posts");
						this.title = '';
						this.text = '';
					}).catch(e => {
						console.error(e);
					});
				}
			}
		},
	},
	created : function() {
		this.title = this.params.post.title;
		this.text = this.params.post.text;
	}

});