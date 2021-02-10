import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonFormElementsModule } from 'v-dynamic-forms';
import { SuiModule } from 'v-sb-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HttpClientModule } from '@angular/common/http';
import { EditorComponent } from './components/editor/editor.component';
import { QuestionComponent } from './components/question/question.component';
import { HeaderComponent } from './components/header/header.component';
import { TreeComponent } from './components/tree/tree.component';
import { AnswerComponent } from './components/answer/answer.component';
import { OptionsComponent } from './components/options/options.component';
import { QuestionSetComponent } from './components/question-set/question-set.component';
import { PlayerComponent } from './components/player/player.component';
import { TemplateComponent } from './components/template/template.component';
import { CkeditorToolComponent } from './components/ckeditor-tool/ckeditor-tool.component';
import { QumlLibraryModule } from '@project-sunbird/sunbird-quml-player';
import {CarouselModule} from 'ngx-bootstrap/carousel';
import { TelemetryInteractDirective } from './directives/telemetry-interact/telemetry-interact.directive';

@NgModule({
  declarations: [EditorComponent, QuestionComponent, HeaderComponent,
  TreeComponent, AnswerComponent, OptionsComponent, QuestionSetComponent, PlayerComponent, TemplateComponent, CkeditorToolComponent,
  TelemetryInteractDirective],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    CommonFormElementsModule,
    InfiniteScrollModule,
    HttpClientModule,
    SuiModule,
    QumlLibraryModule,
    CarouselModule.forRoot()
  ],
  exports: [EditorComponent]
})
export class QuestionEditorLibraryModule { }
