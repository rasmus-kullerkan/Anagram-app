<?php

namespace app\models;

use Yii;
use yii\base\Model;

use app\models\User;

class RegisterForm extends Model {
    public $username;
    public $password;

    public function rules() {
        return [
            [['username', 'password'], 'required'],
            [['username', 'password'], 'string'],
            ['username', 'uniqueUsername'],
        ];
    }

    public function uniqueUsername($attribute, $params) {
        if (!$this->hasErrors()) {
            if (User::findByUsername($this->username)) {
                $this->addError('username', 'Username already taken.');
            }
        }
    }

    public function register() {
        if ($this->validate()) {
            $user = new User();
            $user->username = $this->username;
            $user->password = $hash = Yii::$app->getSecurity()->generatePasswordHash($this->password);
            $user->save();

            return true;
        }

        return false;
    }
}