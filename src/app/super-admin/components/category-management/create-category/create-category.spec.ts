import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategory } from './create-category';

describe('CreateCategory', () => {
  let component: CreateCategory;
  let fixture: ComponentFixture<CreateCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
