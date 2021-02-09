import { Component, OnInit, Input, OnDestroy, HostListener, Output, EventEmitter, ViewChild } from '@angular/core';
import { EditorConfig } from '../../question-editor-library-interface';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import * as _ from 'lodash-es';
import { EditorService, TreeService, EditorTelemetryService, HelperService, FrameworkService, ToasterService } from '../../services';

@Component({
  selector: 'lib-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() editorConfig: EditorConfig | undefined;
  @Output() editorEmitter = new EventEmitter<any>();
  @ViewChild('modal', {static: false}) private modal;
  public toolbarConfig: any;
  public templateList: any;
  public collectionTreeNodes: any;
  public selectedNodeData: any = {};
  public questionComponentInput: any = {};
  public libraryComponentInput: any = {};
  public showQuestionTemplatePopup = false;
  public showDeleteContentPopup = false;
  public showPublishCollectionPopup = false;
  public showConfirmPopup = false;
  public submitFormStatus = true;
  public terms = false;
  public collectionId;
  public pageStartTime;
  public editorMode;
  public pageId = 'question_set';
  public rootFormConfig: any;

  constructor(private editorService: EditorService, private treeService: TreeService, private helperService: HelperService,
              public telemetryService: EditorTelemetryService, private frameworkService: FrameworkService,
              private toasterService: ToasterService) {}

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    this.generateTelemetryEndEvent();
  }

  ngOnInit() {
    this.editorService.initialize(this.editorConfig);
    this.editorMode = this.editorService.editorMode;
    this.toolbarConfig = this.editorService.getToolbarConfig();
    this.pageStartTime = Date.now();
    this.collectionId = _.get(this.editorConfig, 'context.identifier');
    this.telemetryService.initializeTelemetry(this.editorConfig);
    this.telemetryService.telemetryPageId = this.pageId;
    this.helperService.initialize(_.get(this.editorConfig, 'context.defaultLicense'));
    this.telemetryService.start({type: 'editor', pageid: this.telemetryService.telemetryPageId});
    this.initialize();
  }

  initialize() {
    this.fetchQuestionSetHierarchy().subscribe(res => {
      const organisationFramework = _.get(this.editorConfig, 'context.framework') || _.get(res, 'framework');
      this.frameworkService.initialize(organisationFramework);
      this.templateList = _.get(this.editorConfig, 'config.children.Question');
      this.editorService.getCategoryDefinition(this.editorConfig.config.primaryCategory,
        this.editorConfig.context.channel, this.editorConfig.config.objectType).pipe(catchError(error => {
        const errInfo = {
          errorMsg: 'Fetching question set config details failed. Please try again...',
        };
        return throwError(this.editorService.apiErrorHandling(error, errInfo));
      })).subscribe((response) => {
        this.rootFormConfig = _.get(response, 'result.objectCategoryDefinition.forms.create.properties');
      });
    });
  }


  fetchQuestionSetHierarchy() {
    return this.editorService.getQuestionSetHierarchy(this.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Fetching question set details failed. Please try again...',
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    }), tap( res => {
      this.toolbarConfig.title = res.name;
      this.collectionTreeNodes = res;
      if (_.isEmpty(res.children)) {
        this.toolbarConfig.showSubmitBtn = false;
      } else {
        this.toolbarConfig.showSubmitBtn = true;
      }
    }));
  }

  toolbarEventListener(event: any) {
    switch (event.button.type) {
      case 'backContent':
        this.redirectToChapterListTab();
        break;
      case 'saveCollection':
        this.saveCollection();
        break;
      case 'submitCollection':
        this.submitHandler();
        break;
      case 'removeContent':
        this.showDeleteContentPopup = true;
        break;
      case 'editContent':
        this.redirectToQuestionTab('edit');
        break;
      case 'showQuestionTemplate':
        this.showQuestionTemplatePopup = true;
        break;
      case 'onFormStatusChange':
        this.submitFormStatus = event.event.isValid;
        break;
      case 'onFormValueChange':
        this.updateToolbarTitle(event);
        break;
      case 'publishCollection':
        this.showPublishCollectionPopup = true;
        break;
      case 'rejectCollection':
        this.rejectCollection();
        break;
      case 'addFromLibrary':
        this.showLibraryComponentPage();
        break;
      default:
        break;
    }
  }

  updateToolbarTitle(data: any) {
    if (!_.isEmpty(data.event.name)) {
      this.toolbarConfig.title = data.event.name;
    } else {
      this.toolbarConfig.title = 'Untitled';
    }
  }

  saveCollection() {
    if (!this.validateFormStatus()) { return false; }
    this.editorService.updateQuestionSetHierarchy().pipe(catchError(error => {
        const errInfo = {
          errorMsg: 'Saving question set details failed. Please try again...',
        };
        return throwError(this.editorService.apiErrorHandling(error, errInfo));
      }), map(data => _.get(data, 'result'))).subscribe(response => {
        if (!_.isEmpty(response.identifiers)) {
          this.treeService.replaceNodeId(response.identifiers);
        }
        this.treeService.clearTreeCache();
        this.toasterService.success('Question set is updated successfully');
      });
  }

  submitHandler() {
    if (this.validateFormStatus()) {
      this.showConfirmPopup = true;
    }
  }

  validateFormStatus() {
    if (!this.submitFormStatus) {
      this.toasterService.error('Please fill the required metadata');
      this.treeService.setActiveNode(true);
      return false;
    }
    return true;
  }

  submitCollection() {
    this.editorService.sendQuestionSetForReview(this.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Sending question set for review failed. Please try again...',
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.showConfirmPopup = false;
      this.toasterService.success('Question set sent for review');
      this.redirectToChapterListTab();
    });
  }

  publishCollection() {
    this.editorService.publishQuestionSet(this.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Publishing question set failed. Please try again...',
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.toasterService.success('Question set published successfully');
      this.showPublishCollectionPopup = false;
      this.redirectToChapterListTab();
    });
  }

  rejectCollection() {
    this.editorService.rejectQuestionSet(this.collectionId).pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Rejecting question set failed. Please try again...',
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    })).subscribe(res => {
      this.toasterService.success('Question set rejected successfully');
      this.redirectToChapterListTab();
    });
  }


  removeContent() {
    this.treeService.removeNode();
    const rootFirstChildNode = this.treeService.getFirstChild();
    if (rootFirstChildNode && !rootFirstChildNode.children) {
      this.toolbarConfig.showSubmitBtn = false;
    }
    this.showDeleteContentPopup = false;
  }

  treeEventListener(event: any) {
    switch (event.type) {
      case 'nodeSelect':
        this.selectedNodeData = event.data;
        console.log(this.selectedNodeData);
        break;
      default:
        break;
    }
  }

  handleTemplateSelection($event) {
    const selectedQuestionType = $event;
    this.showQuestionTemplatePopup = false;
    if (selectedQuestionType && selectedQuestionType.type === 'close') {
      return false;
    }
    // tslint:disable-next-line:max-line-length
    this.editorService.getCategoryDefinition(selectedQuestionType, null, 'Question').pipe(catchError(error => {
      const errInfo = {
        errorMsg: 'Fetch question set template failed. Please try again...',
      };
      return throwError(this.editorService.apiErrorHandling(error, errInfo));
    })).subscribe((res) => {
      const selectedtemplateDetails = res.result.objectCategoryDefinition;
      const catMetaData = selectedtemplateDetails.objectMetadata;
      if (_.isEmpty(_.get(catMetaData, 'schema.properties.interactionTypes.items.enum'))) {
          // this.toasterService.error(this.resourceService.messages.emsg.m0026);
          this.editorService.selectedChildren = {
            primaryCategory: selectedQuestionType,
            mimeType: catMetaData.schema.properties.mimeType.enum[0],
            interactionType: null
          };
          this.redirectToQuestionTab(undefined, 'default');
      } else {
        const interactionTypes = catMetaData.schema.properties.interactionTypes.items.enum;
        this.editorService.selectedChildren = {
          primaryCategory: selectedQuestionType,
          mimeType: catMetaData.schema.properties.mimeType.enum[0],
          interactionType: interactionTypes[0]
        };
        this.redirectToQuestionTab(undefined, interactionTypes[0]);
      }
    });
  }

  redirectToQuestionTab(mode, interactionType?) {
    this.questionComponentInput = {
      questionSetId: this.collectionId,
      questionId: mode === 'edit' ? this.selectedNodeData.data.metadata.identifier : undefined,
      type: interactionType
    };
    this.pageId = 'question';
  }

  questionEventListener(event: any) {
    this.selectedNodeData = undefined;
    this.fetchQuestionSetHierarchy().subscribe((res: any) => {
      this.pageId = 'question_set';
      this.telemetryService.telemetryPageId = this.pageId;
    });
  }

  showLibraryComponentPage() {
    this.libraryComponentInput = {
      questionSetId: this.collectionId
    };
    this.pageId = 'library';
  }

  libraryEventListener(event: any) {
    this.pageId = 'question_set';
    this.telemetryService.telemetryPageId = this.pageId;
  }

  generateTelemetryEndEvent() {
    const telemetryEnd = {
        type: 'editor',
        pageid: this.telemetryService.telemetryPageId,
        duration: _.toString((Date.now() - this.pageStartTime) / 1000),
        mode: this.editorMode
    };
    this.telemetryService.end(telemetryEnd);
  }

  redirectToChapterListTab() {
    this.editorEmitter.emit({close: true, library: 'question_set_editor'});
  }

  ngOnDestroy() {
    this.generateTelemetryEndEvent();
    if (this.modal && this.modal.deny) {
      this.modal.deny();
    }
    this.treeService.clearTreeCache();
  }

}
