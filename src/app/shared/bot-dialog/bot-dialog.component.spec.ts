import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotDialogComponent } from './bot-dialog.component';

describe('BotDialogComponent', () => {
  let component: BotDialogComponent;
  let fixture: ComponentFixture<BotDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
