import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskFilterComponent } from './task-filter.component';

describe('TaskFilterComponent', () => {
  let component: TaskFilterComponent;
  let fixture: ComponentFixture<TaskFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFilterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChanged with selected value on onSelectionChange', (done) => {
    component.selected = 'completed';
    component.filterChanged.subscribe((value) => {
      expect(value).toBe('completed');
      done();
    });
    component.onSelectionChange();
  });

  it('should emit validateClicked with trimmed lowercase searchTerm on onValidateSearch', (done) => {
    component.searchTerm = '  TestSearch  ';
    component.validateClicked.subscribe((value) => {
      expect(value).toBe('testsearch');
      done();
    });
    component.onValidateSearch();
  });

  it('should reset searchTerm and emit validateClicked with empty string on resetSearch', (done) => {
    component.searchTerm = 'something';
    component.validateClicked.subscribe((value) => {
      expect(value).toBe('');
      expect(component.searchTerm).toBe('');
      done();
    });
    component.resetSearch();
  });

  it('should emit addClicked on onAdd', (done) => {
    component.addClicked.subscribe(() => {
      done();
    });
    component.onAdd();
  });
});
