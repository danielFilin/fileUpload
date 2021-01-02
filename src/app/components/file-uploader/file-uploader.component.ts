import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { pipe } from 'rxjs';
import { finalize} from 'rxjs/operators';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  message: string;
  selectedFiles: FileList;

  formTemplate = new FormGroup({
    caption: new FormControl('')
  })

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  uploadFiles(event) {
    this.selectedFiles = event.target.files;
    this.message = '';

    for (let i = 0; i < this.selectedFiles.length; i++) {
       let filePath = `${this.selectedFiles[i]}_${new Date().getTime()}`;
       const fileRef = this.storage.ref(filePath);
       this.storage.upload(filePath, this.selectedFiles[i]).snapshotChanges()
       .pipe(finalize(()=> {
         fileRef.getDownloadURL().subscribe((url) => {
           console.log(url);
         })
       })
       ).subscribe();
    }
  }


}
