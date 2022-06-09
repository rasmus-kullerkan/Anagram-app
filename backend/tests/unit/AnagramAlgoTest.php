<?php

use app\helpers\AnagramHelper;

class AnagramAlgoTest extends \Codeception\Test\Unit {
    /**
     * @var \UnitTester
     */
    protected $tester;

    const WORDBASE = ["apple", "pear", "lemon"];
    
    public function testAnagramAlgorithm() {
        expect(AnagramHelper::findAnagrams("reap", self::WORDBASE))->equals(["pear"]);
    }
}