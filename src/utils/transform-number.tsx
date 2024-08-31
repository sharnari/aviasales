  export class NumberTransformation {
    
    /*
    * return transform number with space between thousand
    */
    spaceDigits = (num: number): string => {
      return num.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }
  }
