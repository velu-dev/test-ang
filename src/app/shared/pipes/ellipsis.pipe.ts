import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis'
})
export class EllipsisPipe implements PipeTransform {

  transform(str: string, strLength: number = 250) {

    if (str.length >= strLength) {
      return `${str.slice(0, strLength)}...`;
    }

    return str;
  }

}
