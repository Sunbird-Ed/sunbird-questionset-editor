import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const mockData = { event : {}, button: { type: 'previewContent'} };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('#buttonEmitter() should emit #toolbarEmitter event when button cliked!', () => {
    spyOn(component.toolbarEmitter, 'emit');
    component.buttonEmitter(mockData.event, mockData.button);
    expect(component.toolbarEmitter.emit).toHaveBeenCalledWith(mockData);
  });

});
