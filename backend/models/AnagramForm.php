<?php

namespace app\models;

use Yii;
use yii\base\Model;

class AnagramForm extends Model {
    public $wordbaseName;
    public $word;

    public function rules() {
        return [
            [['wordbaseName', 'word'], 'required'],
            [['wordbaseName', 'word'], 'string']  
        ];
    }
}