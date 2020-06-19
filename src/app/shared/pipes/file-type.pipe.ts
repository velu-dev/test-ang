import { Pipe, PipeTransform } from '@angular/core';
import * as globals from './../../globals';
@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {
  xls = globals.xls;
  xls_1 = globals.xls_1
  docx = globals.docx
  pdf = globals.pdf
  transform(value: any, ...args: any[]): any {
   if(value){
     let fileNanme = value.split('.').pop().toLowerCase();
     if(fileNanme == 'xls' || fileNanme == 'xlsx') return this.xls;
     else if(fileNanme == 'docx' || fileNanme == 'doc') return this.docx;
     else if(fileNanme == 'pdf') return this.pdf;
     else if(fileNanme == 'csv') return this.xls_1;
     else return this.docx
   }
    return null;
  }

}
