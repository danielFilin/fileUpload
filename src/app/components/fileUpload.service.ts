import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  fileDetailList:AngularFireList<any>;

  constructor(private firebase: AngularFireDatabase) { }

  getFileDetailList() {
    this.fileDetailList = this.firebase.list('fileDetails');
  }

  insertImageDetails(fileDetails) {
    this.fileDetailList.push(fileDetails);
  }
}
