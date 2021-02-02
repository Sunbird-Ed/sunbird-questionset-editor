import { TestBed } from '@angular/core/testing';

import { EditorTelemetryService } from './editor-telemetry.service';

describe('EditorTelemetryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EditorTelemetryService = TestBed.get(EditorTelemetryService);
    expect(service).toBeTruthy();
  });
});
