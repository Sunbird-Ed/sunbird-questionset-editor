import { TestBed } from '@angular/core/testing';

import { QuestionEditorLibraryService } from './question-editor-library.service';

describe('QuestionEditorLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QuestionEditorLibraryService = TestBed.get(QuestionEditorLibraryService);
    expect(service).toBeTruthy();
  });
});
