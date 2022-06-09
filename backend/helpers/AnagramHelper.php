<?php

namespace app\helpers;

class AnagramHelper {
    public static function findAnagrams($word, $wordbase) {
        $anagrams = [];

        // TODO Better data structure maybe.

        // Find a match for each char. If match is found, remove char from pool. If the pool is empty then the word is an anagram.

        $wordChars = str_split($word);

        foreach ($wordbase as &$wbWord) {
            if (strlen($word) == strlen($wbWord) && strcmp($word, $wbWord) != 0) {
                $wbWordChars = str_split($wbWord);

                foreach ($wordChars as &$wordChar) {
                    $index = 0;
                    foreach ($wbWordChars as &$wbWordChar) {
                        if (strcmp($wordChar, $wbWordChar) == 0) {
                            unset($wbWordChars[$index]);
                            $wbWordChars = array_values($wbWordChars);

                            break; // foreach ($wbWordChars as &$wbWordChar) 
                        }
                        $index++;
                    }
                }

                if(empty($wbWordChars)) {
                    array_push($anagrams, $wbWord);
                }
            }
        }

        return $anagrams;
    }
}