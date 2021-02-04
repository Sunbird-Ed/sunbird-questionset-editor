import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { map } from 'rxjs/operators';
import { TreeService, DataService, ToasterService, EditorTelemetryService } from '../../services';
import { labelConfig} from '../../editor.config';
import { EditorConfig } from '../../question-editor-library-interface';
interface SelectedChildren {
  primaryCategory?: string;
  mimeType?: string;
  interactionType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  data: any;
  private _selectedChildren: SelectedChildren = {};
  public questionStream$ = new Subject<any>();
  private _editorMode = 'edit';
  private _editorConfig: EditorConfig;


  constructor(public treeService: TreeService, private dataService: DataService, private toasterService: ToasterService,
              private telemetryService: EditorTelemetryService) { }

  public initialize(config: EditorConfig) {
    this._editorConfig = config;
    this._editorMode = _.get(this._editorConfig, 'config.mode');
  }

  set selectedChildren(value: SelectedChildren) {
    if (value.mimeType) {
      this._selectedChildren.mimeType = value.mimeType;
    }
    if (value.primaryCategory) {
      this._selectedChildren.primaryCategory = value.primaryCategory;
    }
    if (value.interactionType) {
      this._selectedChildren.interactionType = value.interactionType;
    }
  }

  get selectedChildren() {
    return this._selectedChildren;
  }

  get editorMode() {
    return this._editorMode;
  }

  get editorConfig() {
    return this._editorConfig;
  }

  getToolbarConfig() {
    return _.cloneDeep(_.merge(labelConfig, _.get(this.editorConfig, 'context.labels')));
  }

  public getQuestionSetHierarchy(identifier: string) {
    console.log('getQuestionSetHierarchy ');
    const req = {
      url: `questionset/v1/hierarchy/${identifier}`,
      param: { mode: 'edit'}
    };
    return this.dataService.get(req).pipe(map((res: any) => _.get(res, 'result.questionSet')));
  }

  public updateQuestionSetHierarchy(): Observable<any> {
    const req = {
      url: 'questionset/v1/hierarchy/update',
      data: {
        request: {
          data: {
            ...this.prepareQuestionSetHierarchy(),
            ...{lastUpdatedBy: _.get(this.editorConfig, 'context.user.id')}
          }
        }
      }
    };
    return this.dataService.patch(req);
  }

  public sendQuestionSetForReview(identifier: string): Observable<any> {
    const req = {
      url: `questionset/v1/review/${identifier}`,
      data: {
        request : {
            questionSet: {}
        }
    }
    };
    return this.dataService.post(req);
  }

  public publishQuestionSet(identifier: string): Observable<any> {
    const req = {
      url: `questionset/v1/publish/${identifier}`,
      data: {
        request : {
            questionSet: {}
        }
    }
    };
    return this.dataService.post(req);
  }

  public rejectQuestionSet(identifier: string): Observable<any> {
    const req = {
      url: `questionset/v1/reject/${identifier}`,
      data: {
        request : {
            questionSet: {}
        }
    }
    };
    return this.dataService.post(req);
  }

  public getQuestionStream$() {
    return this.questionStream$;
  }

  public publish(value: any) {
    this.questionStream$.next(value);
  }

  prepareQuestionSetHierarchy() {
    this.data = {};
    const data = this.treeService.getFirstChild();
    return {
      nodesModified: this.treeService.treeCache.nodesModified,
      hierarchy: this._toFlatObj(data)
    };
  }

  _toFlatObj(data) {
    const instance = this;
    if (data && data.data) {
      instance.data[data.data.id] = {
        name: data.data.metadata.name,
        // 'contentType': data.data.objectType,
        children: _.map(data.children, (child) => {
          return child.data.id;
        }),
        root: data.data.root
      };

      _.forEach(data.children, (collection) => {
        instance._toFlatObj(collection);
      });
    }
    return instance.data;
  }

  getCategoryDefinition(categoryName, rootOrgId, objectType?: any) {
    const req = {
      url: 'object/category/definition/v1/read?fields=objectMetadata,forms,name',
      data: {
        request: {
          objectCategoryDefinition: {
              objectType: objectType ? objectType : 'Content',
              name: categoryName
              // 'channel': rootOrgId
          },
        }
      }
    };
    return this.dataService.post(req);
  }

  apiErrorHandling(err, errorInfo) {
    if (_.get(err, 'error.params.errmsg') || errorInfo.errorMsg) {
      this.toasterService.error(_.get(err, 'error.params.errmsg') || errorInfo.errorMsg);
    }
    const telemetryErrorData = {
        err: _.toString(err.status),
        errtype: 'SYSTEM',
        stacktrace: JSON.stringify({response: _.pick(err, ['error', 'url']), request: _.get(errorInfo, 'request')}) || errorInfo.errorMsg,
        pageid: this.telemetryService.telemetryPageId
    };
    this.telemetryService.error(telemetryErrorData);
  }

}
