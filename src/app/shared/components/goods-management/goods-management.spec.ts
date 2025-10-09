import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsManagement } from './goods-management';

describe('GoodsManagement', () => {
  let component: GoodsManagement;
  let fixture: ComponentFixture<GoodsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoodsManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
