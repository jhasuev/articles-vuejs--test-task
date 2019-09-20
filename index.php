<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Статьи | Vue Project</title>

	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="css/styles.css?t=<?php echo filemtime('css/styles.css');?>">
</head>
<body>


	<div id="app" style="display: none;" :style="{display:'block'}">
		<header class="header">
			<div class="container">
				<div class="header__container">
					<router-link class="header__item" active-class="header__item--active" to="/login" v-if="!is_admin">Войти</router-link>
					<router-link class="header__item" active-class="header__item--active" to="/logout" v-if="is_admin">Выйти</router-link>
					<router-link class="header__item" active-class="header__item--active" to="/edit" v-if="is_admin">Редактирование товаров</router-link>
				</div>
			</div>
		</header>
		
		<router-view></router-view>

		<app-popup></app-popup>
		
	</div>


	<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	<script src="https://unpkg.com/vue/dist/vue.js"></script>
	<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
	<script src="js/routes.js?t=<?php echo filemtime('js/routes.js');?>"></script>
	<script src="js/components.js?t=<?php echo filemtime('js/components.js');?>"></script>
	<script src="js/scripts.js?t=<?php echo filemtime('js/scripts.js');?>"></script>
</body>
</html>