<?php

namespace app\controllers;

use yii\rest\ActiveController;
use yii\web\MethodNotAllowedHttpException;
use yii\filters\AccessControl;

use app\models\Wordbase;

class WordbaseController extends ActiveController {
    public $modelClass = 'app\models\Wordbase';

    public function init() {
        parent::init();
        // Disable csrf
        $this->enableCsrfValidation = false;
    }

    // Use verbs() for ActiveController allowed methods
    protected function verbs() {
        return [
            'index' => ['GET','OPTIONS'],
            'create' => ['POST','OPTIONS'],
            'names' => ['GET','OPTIONS'],
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
            'except' => ['options']
        ];

        // Allowed actions
        $behaviors['access'] = [
            'class' => \yii\filters\AccessControl::class,
            'rules' => [
                [
                    'actions' => ['options', 'create', 'names', 'index'],
                    'allow' => true,
                ],
            ],
            'denyCallback' => function ($rule, $action) {
                throw new MethodNotAllowedHttpException("Method not allowed");
            }
        ];

        return $behaviors;
    }

    // GET all wordbase names
    public function actionNames() {
        return ['names' => Wordbase::find()->select(['name'])->column()];
    }
}