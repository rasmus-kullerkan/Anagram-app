<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use yii\web\IdentityInterface;
use yii\web\UnauthorizedHttpException;

class User extends ActiveRecord implements IdentityInterface {
    public static function tableName() {
        return 'user';
    }

    public function rules() {
        return [
            [['username', 'password'], 'required'],
            [['username', 'password'], 'string'],
            ['username', 'unique']      
        ];
    }

    public function getId(){
        return $this->getPrimaryKey();
    }

    public static function findIdentityByAccessToken($token, $type = null) {
        $user = static::findOne(['accessToken' => $token]);

        if (!$user) {
            return false;
        }

        // Check if token has expired.
        if ($user->accessTokenExpiresAt < date('Y-m-d H:i:s')) {
            throw new UnauthorizedHttpException("Access token has expired.");
        } else {
            return $user;
        }
    }

    // Not needed for REST.
    public function getAuthKey() {}
    public function validateAuthKey($authKey) {}
    public static function findIdentity($id) {}

    public static function findByUsername($username) {
        return static::findOne(['username' => $username]);
    }

    public function validatePassword($password) {
        return Yii::$app->getSecurity()->validatePassword($password, $this->password);
    }

    public function generateAccessToken() {
        $this->accessToken=Yii::$app->security->generateRandomString();
        return $this->accessToken;
    }
}
