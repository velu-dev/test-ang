import { Injectable } from '@angular/core';
import {saveAs } from 'file-saver';
import { WorkBook, WorkSheet , utils, write} from 'xlsx';
// import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    fileExtension = '.xlsx';

    constructor() {

    }
    exportExcel(jsonData: any[], fileName: string): void {
        const ws: WorkSheet = utils.json_to_sheet(jsonData);
        const wb: WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer: any = write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, fileName);
    }

    saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.fileType });
        saveAs(data, fileName + this.fileExtension);
    }
}