import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTablePredictComponent } from './group-table-predict.component';

describe('GroupTablePredictComponent', () => {
  let component: GroupTablePredictComponent;
  let fixture: ComponentFixture<GroupTablePredictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupTablePredictComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupTablePredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
