class TextUtils
{
  /** Count number of occurances of `countString` in `string`
   * @param {String} string               The string
   * @param {String} countString            The sub string to search for
   * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
   *
   * @author Vitim.us https://gist.github.com/victornpb/7736865
   * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
   * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
   **/

   static count(string, countString, allowOverlapping)
   {
     string += "";
     countString += "";
     if (countString.length <= 0) return (string.length + 1);

     var n = 0,
         pos = 0,
         step = allowOverlapping ? 1 : countString.length;

     while (true) {
         pos = string.indexOf(countString, pos);
         if (pos >= 0) {
             ++n;
             pos += step;
         } else break;
     }
     return n;
   }

 }
