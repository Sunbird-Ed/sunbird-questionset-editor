import { Component } from '@angular/core';
import { Config } from './data';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sunbird-questionset-editor';
  editorConfig = Config;
  showEditor = true;

  editorEventListener(event) {
    this.showEditor = false;
    console.log(event);
  }

}
