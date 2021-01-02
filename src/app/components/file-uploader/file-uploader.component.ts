import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.css']
})
export class FileUploaderComponent {
  message: string;
  selectedFiles: FileList;
  progressInfos = [];
  task = [];
  uploadWindow: Boolean = true;

  constructor(private storage: AngularFireStorage) { }

  uploadFiles(event) {
    this.selectedFiles = event.target.files;
    this.message = '';
    for (let i = 0; i < this.selectedFiles.length; i++) {
        this.upload(i, this.selectedFiles[i])
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    const filePath = file.name;
    this.task[idx] = this.storage.upload(filePath, file);
    this.task[idx].percentageChanges()
    .subscribe((res) => {
      this.progressInfos[idx].value = res;
    }),
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      };
  };

  onToggleView() {
    if (this.uploadWindow) {
      this.uploadWindow = false;
    } else {
      this.uploadWindow = true;
    }
  }

  stopAll() {
    this.progressInfos.length = 0;
    this.task.forEach( task => task.pause());
  }

}
