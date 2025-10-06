import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HeaderInternoComponent } from './header-interno.component';

describe('HeaderInternoComponent', () => {
  let component: HeaderInternoComponent;
  let fixture: ComponentFixture<HeaderInternoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HeaderInternoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderInternoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
