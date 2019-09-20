<?php
session_start();

$posts_file_name = 'posts.db';
$answer = '';

switch ($_GET['act']) {
	case 'get_posts':
		if (file_exists($posts_file_name)) {
			$answer = file_get_contents($posts_file_name);
		}

		break;
	case 'add_post':
		if ($_SESSION['is_admin']) {
			if (file_exists($posts_file_name)) {
				$posts = json_decode(file_get_contents($posts_file_name), true);
			} else {
				$posts = array();
			}

			array_unshift($posts, array(
				'title' => $_GET['title'],
				'text' => $_GET['text'],
				'date' => time(),
			));

			file_put_contents($posts_file_name, json_encode($posts));
		}

		break;
	case 'edit_post':
		if ($_SESSION['is_admin']) {
			if (file_exists($posts_file_name)) {
				$posts = json_decode(file_get_contents($posts_file_name), true);
			} else {
				$posts = array();
			}

			$posts[$_GET['post_id']]['title'] = $_GET['title'];
			$posts[$_GET['post_id']]['text'] = $_GET['text'];

			file_put_contents($posts_file_name, json_encode($posts));
		}

		break;
	case 'remove_post':
		if ($_SESSION['is_admin']) {
			if (file_exists($posts_file_name)) {
				$posts = json_decode(file_get_contents($posts_file_name), true);
			} else {
				$posts = array();
			}

			array_splice($posts, (int)$_GET['post_id'], 1);

			file_put_contents($posts_file_name, json_encode($posts));
		}

		break;
	case 'check_admin':
		$answer = $_SESSION['is_admin'];
		break;
	case 'login':
		$admin_data = require_once "admin_pwd.php";
		if ($admin_data['login'] == $_GET['login'] &&
			$admin_data['password'] == $_GET['password']) {

			$answer = $_SESSION['is_admin'] = 1;
		} else {
			$answer = 0;
		}
		break;
	case 'logout':
		$_SESSION['is_admin'] = 0;
		$answer = 1;
		break;
}

echo $answer;
