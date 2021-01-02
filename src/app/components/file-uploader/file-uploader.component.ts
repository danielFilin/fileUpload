import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, pipe } from 'rxjs';
import { finalize} from 'rxjs/operators';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent implements OnInit {
  message: string;
  selectedFiles: FileList;
  progressInfos = [];

  fileInfos: Observable<any>;

  constructor(private storage: AngularFireStorage) { }

  ngOnInit(): void {
  }

  uploadFiles(event) {
    this.selectedFiles = event.target.files;
    this.message = '';

    for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i])
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    console.log(this.progressInfos[idx]);

    //let filePath = `${file}_${new Date().getTime()}`;
    const filePath = file.name;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.percentageChanges()
    .pipe(finalize(()=> {
      fileRef.getDownloadURL().subscribe((url) => {
        //this.progressInfos[idx].value = Math.round(100 * url.loaded / url.total);
      })
    })
    )
    .subscribe((res) => {
      this.progressInfos[idx].value = res;
      console.log(res);
    }),
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      };
  };

  // stopUpload(fileName, file) {
  //   const task = this.storage.upload(fileName, file);

  // }


  // upload(idx, file) {
  //   this.progressInfos[idx] = { value: 0, fileName: file.name };

  //   let filePath = `${file}_${new Date().getTime()}`;
  //   const fileRef = this.storage.ref(filePath);
  //   this.storage.upload(filePath, file).snapshotChanges( )
  //   .pipe(finalize(()=> {
  //     fileRef.getDownloadURL().subscribe((url) => {
  //       this.progressInfos[idx].value = Math.round(100 * url.loaded / url.total);
  //       console.log(url);
  //     })
  //   })
  //   )
  //   .subscribe((res) => {
  //     console.log(res);
  //   }),
  //     err => {
  //       this.progressInfos[idx].value = 0;
  //       this.message = 'Could not upload the file:' + file.name;
  //     };
  // }

}
