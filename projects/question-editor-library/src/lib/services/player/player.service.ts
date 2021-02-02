import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { EditorService } from '../../services';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private editorService: EditorService) { }

  /**
   * returns player config details.
   */
  getConfig() {
    const configuration: any = _.cloneDeep(this.editorService.editorConfig);
    configuration.context.mode = 'play';
    configuration.metadata = {};
    configuration.data = {};
    return configuration;
  }
}
