/* convISBN.js : converter ISBN10 <-> ISBN13                 */
/*   Copyright (c) 2007 by H.Tsujimura  <tsupo@na.rim.or.jp> */
/*   Distributed by LGPL.                                    */
/*      this script written by H.Tsujimura  20 Jan 2007      */

/* Obtained for BibliOsa from https://gist.github.com/tsupo/108922 | July 2018 */

export function convISBN13toISBN10(str) {
    let s;
    let c;
    let checkDigit = 0;
    let result = "";

    s = str.substring(3,str.length);
    for (let i = 10; i > 1; i-- ) {
        c = s.charAt(10 - i);
        checkDigit += (c - 0) * i;
        result += c;
    }
    checkDigit = (11 - (checkDigit % 11)) % 11;
    result += checkDigit === 10 ? 'X' : (checkDigit + "");

    return ( result );
}

export function convISBN10toISBN13(str) {
    let c;
    let checkDigit = 0;
    let result = "";

    c = '9';
    result += c;
    checkDigit += (c - 0) * 1;

    c = '7';
    result += c;
    checkDigit += (c - 0) * 3;

    c = '8';
    result += c;
    checkDigit += (c - 0) * 1;

    for (let i = 0; i < 9; i++ ) {  // >
        c = str.charAt(i);
        if ( i % 2 === 0 )
            checkDigit += (c - 0) * 3;
        else
            checkDigit += (c - 0) * 1;
        result += c;
    }
    checkDigit = (10 - (checkDigit % 10)) % 10;
    result += (checkDigit + "");

    return ( result );
}
