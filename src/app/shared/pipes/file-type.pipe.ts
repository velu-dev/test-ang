import { Pipe, PipeTransform } from '@angular/core';
import * as globals from './../../globals';
@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {
  xls_1 = globals.xls_1;
  docx = globals.docx;
  pdf = globals.pdf;
  csv = globals.csv;
  empty = globals.file;
  transform(value: any, ...args: any[]): any {
   if(value){
     let fileNanme = value.split('.').pop().toLowerCase();
     if(fileNanme == 'xls' || fileNanme == 'xlsx') return this.xls_1;
     else if(fileNanme == 'docx' || fileNanme == 'doc') return this.docx;
     else if(fileNanme == 'pdf') return this.pdf;
     else if(fileNanme == 'csv') return this.csv;
     else return this.empty
   }
    return null;
  }

}
