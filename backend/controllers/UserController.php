<?php

namespace app\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\HttpException;
use yii\web\MethodNotAllowedHttpException;
use yii\filters\AccessControl;

use app\models\User;
use app\models\RegisterForm;
use app\models\LoginForm;
use app\helpers\ValidationHelper;

class UserController extends ActiveController {
    public $modelClass = 'app\models\User';

    public function init() {
        parent::init();
        // Disable csrf
        $this->enableCsrfValidation = false;
    }

    // Use verbs() for ActiveController allowed methods
    protected function verbs() {
        return [
            'create' => ['POST', 'OPTIONS'],
            'login' => ['POST', 'OPTIONS'],
            'logout' => ['POST', 'OPTIONS'],
        ];
    }

    public function behaviors() {
        $behaviors = parent::behaviors();

        // Needs to be unset before cors filter
        if (array_key_exists('authenticator', $behaviors)) {
            unset($behaviors['authenticator']);
        }

        // Public REST API
        $behaviors['corsFilter'] = [
            'class' => \yii\filters\Cors::class,
            'cors' => [
                'Origin' => ['*'],
                'Access-Control-Allow-Headers' => ['*']
            ]
        ];

        // Enable authentication with Bearer token.
        $behaviors['authenticator'] = [
            'class' => \yii\filters\auth\HttpBearerAuth::class,
            // Don't use authenticatin with these actions
            'except' => ['options', 'login', 'create']
        ];

        // Allowed actions
        $behaviors['access'] = [
            'class' => \yii\filters\AccessControl::class,
            'rules' => [
                [
                    'actions' => ['options', 'create', 'login', 'logout'],
                    'allow' => true,
                ],
            ],
            'denyCallback' => function ($rule, $action) {
                throw new MethodNotAllowedHttpException("Method not allowed");
            }
        ];
        
        return $behaviors;
    }

    // Overide default 'create' action
    public function actions() {
        $actions = parent::actions();

        unset($actions['create']);
        
        return $actions;
    }

    public function actionCreate() {
        $registerForm = new RegisterForm();

        if (!$registerForm->load(Yii::$app->request->post(), '')) {
            throw new HttpException(400, "Submited form is invalid.");
        } else if (!$registerForm->register()) {
            Yii::$app->response->statusCode = 422;
            return ValidationHelper::formatValidationErrors($registerForm->getErrors());
        } else {
            Yii::$app->response->statusCode = 201;
            Yii::$app->response->content = '';
            return;
        }
    }

    public function actionLogin() {
        $loginForm = new LoginForm();

        if (!$loginForm->load(Yii::$app->request->post(), '')) {
            throw new HttpException(400, "Submited form is invalid.");
        } 

        $accessToken = $loginForm->login();

        if ($accessToken) {
            return ['accessToken' => $accessToken];
        } else {
            Yii::$app->response->statusCode = 422;
            return ValidationHelper::formatValidationErrors($loginForm->getErrors());
        }
    }

    public function actionLogout() {
        // Authenticated user.
        $user = Yii::$app->user->identity;
        $user->accessToken=null;
        $user->accessTokenExpiresAt=null;
        $user->save();

        // 200
        Yii::$app->response->content = '';
        return;
    }
}