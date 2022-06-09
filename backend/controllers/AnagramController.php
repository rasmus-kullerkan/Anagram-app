<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\auth\QueryParamAuth;
use yii\web\HttpException;
use yii\web\MethodNotAllowedHttpException;

use app\models\AnagramForm;
use app\models\Wordbase;
use app\helpers\AnagramHelper;
use app\helpers\ValidationHelper;

class AnagramController extends Controller {
    public function init() {
        parent::init();
        // Disable csrf
        $this->enableCsrfValidation = false;
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
                    'actions' => ['options', 'index'],
                    'allow' => true,
                ],
            ],
            'denyCallback' => function ($rule, $action) {
                throw new MethodNotAllowedHttpException("Method not allowed");
            }
        ];

        // Allowed methods
        $behaviors['verbs'] = [
            'class' => \yii\filters\VerbFilter::class,
            'actions' => [
                'index' => ['POST', 'OPTIONS'],
            ],
        ];

        return $behaviors;
    }

    // POST request to find anagram
    public function actionIndex() {
        $anagramFrom = new AnagramForm();

        if ($anagramFrom->load(Yii::$app->request->post(), '') && $anagramFrom->validate()) {
            $word = $anagramFrom->word;

            $wordbase = Wordbase::findOne(['name' => $anagramFrom->wordbaseName]);

            if (!$wordbase) {
                throw new HttpException(400, "'" . $anagramFrom->wordbaseName . "' not found.");
            }

            $words = $wordbase->words;

            return AnagramHelper::findAnagrams($word, $words);
        } else {
            Yii::$app->response->statusCode = 422;
            return ValidationHelper::formatValidationErrors($anagramFrom->getErrors());
        }
    }
}