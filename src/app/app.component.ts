import { Component  , OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';

import { AudioRecordingService } from './audio-recording.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  // title = 'toneflask';
  displayControls = true;
  isAudioRecording = false;
  audioRecordedTime: any;
  audioBlobUrl: any;
  audioBlob: any;
  audioName: any;
  audioStream: any;
  audioConf : any;

  constructor(
    private ref: ChangeDetectorRef,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer
  ) {
    this.audioRecordingService.recordingFailed().subscribe(() => {
      this.isAudioRecording = false;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedTime().subscribe((time) => {
      this.audioRecordedTime = time;
      this.ref.detectChanges();
    });

    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.audioBlob = data.blob;
      this.audioName = data.title;
      this.audioBlobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
      this.ref.detectChanges();
    });
  }

  startAudioRecording() {
    // console.log('in start audio');
    if (!this.isAudioRecording) {
      this.isAudioRecording = true;
      this.audioRecordingService.startRecording();
      setTimeout(() => {
        this.stopAudioRecording();
      }, 10000);
      setTimeout(() => {
        this.downloadAudioRecordedData();
      }, 3000);
    }
  }
  

  abortAudioRecording() {
    if (this.isAudioRecording) {
      this.isAudioRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopAudioRecording() {
    if (this.isAudioRecording) {
      this.audioRecordingService.stopRecording();
      this.isAudioRecording = false;
    }
  }

  clearAudioRecordedData() {
    this.audioBlobUrl = null;
  }

  downloadAudioRecordedData() {
    this._downloadFile(this.audioBlob, 'audio', this.audioName);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.startAudioRecording();
    }, 10000);
  }

  ngOnDestroy(): void {
    this.abortAudioRecording();
  }

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: 'audio/wav; codecs=MS_PCM' });
    // MediaRecorder.isTypeSupported("audio/wav;codecs=MS_PCM")
    new Blob(data, { 'type' : 'audio/wav; codecs=MS_PCM' });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = 'outputwavfromblob';
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
