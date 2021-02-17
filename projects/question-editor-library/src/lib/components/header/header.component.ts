import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import { EditorService } from '../../services/editor/editor.service';
import { EditorTelemetryService } from '../../services/editor-telemetry/editor-telemetry.service';
@Component({
  selector: 'lib-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  @Input() toolbarConfig: any;
  @Input() pageId: any;
  @Output() toolbarEmitter = new EventEmitter<any>();
  public preview = false;

  constructor(public telemetryService: EditorTelemetryService, public editorService: EditorService) {}

  ngOnInit() { }

  buttonEmitter(event, button) {
    this.toolbarEmitter.emit({ event, button });
  }

}
