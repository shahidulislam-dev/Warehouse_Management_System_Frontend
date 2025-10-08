import { TestBed } from '@angular/core/testing';

import { GlobalToastrService } from './global-toastr-service';

describe('GlobalToastrService', () => {
  let service: GlobalToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
