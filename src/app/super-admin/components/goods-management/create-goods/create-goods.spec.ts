import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGoods } from './create-goods';

describe('CreateGoods', () => {
  let component: CreateGoods;
  let fixture: ComponentFixture<CreateGoods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateGoods]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGoods);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
