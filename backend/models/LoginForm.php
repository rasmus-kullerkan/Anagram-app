<?php

namespace app\models;

use Yii;
use yii\base\Model;

class LoginForm extends Model {
    public $username;
    public $password;

    private $_user = false;

    public function rules() {
        return [
            [['username', 'password'], 'required'],
            [['username', 'password'], 'string'],
            ['password', 'validatePassword'],
        ];
    }

    public function getUser() {
        if ($this->_user === false) {
            $this->_user = User::findByUsername($this->username);
        }

        return $this->_user;
    }

    public function validatePassword($attribute, $params) {
        if (!$this->hasErrors()) {
            $user = $this->getUser();

            if (!$user || !$user->validatePassword($this->password)) {
                // User should not know which one is incorrect.
                $this->addError('username', 'Incorrect username or password.');
                $this->addError('password', 'Incorrect username or password.');
            }
        }
    }

    public function login() {
        if ($this->validate()) {
            $accessToken = $this->_user->generateAccessToken();
            // Token expires after 1 day.
            $this->_user->accessTokenExpiresAt = date('Y-m-d H:i:s', strtotime(date('Y-m-d H:i:s') . ' + 1 days'));
            $this->_user->save();
            return $accessToken;
        }
        
        return false;
    }
}